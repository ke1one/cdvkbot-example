'use strict'

import fs from 'fs'
import fetch from 'node-fetch'
import { VK, Updates, Keyboard, Upload } from 'vk-io'
import { client, query } from './tools/database.mjs'
import functions from './tools/functions.mjs'
import config from './tools/config.mjs'

if(config.setting.createDatabase == true) {
	query(`CREATE TABLE users (
		id INTEGER NOT NULL,
		name TEXT NOT NULL
	)`)
}

const bot = new VK({ token: config.groupToken, pollingGroupId: config.groupID }),
api = bot.api, updates = new Updates({ api }), upload = new Upload({ api }),
commands = []

functions.collectGames('commands', commands)

updates.on('message', async(context) => {
	if(context.isGroup) return
	if(context.text) {
		let [user] = await query('SELECT * FROM users WHERE id = $1;', [context.senderId])

		if(user === undefined) {
			let [vkUserData] = await api.users.get({ user_id: context.senderId })
			context.reply(`Registration`)
			await query('INSERT INTO users (id, name) VALUES ($1, $2);', [context.senderId, vkUserData.first_name])
			user = await (await query('SELECT * FROM users WHERE id = $1;', [context.senderId]))[0]
		}

		if(context.text.match(/^\/|!|\./i)) {
			context.text = context.text.replace(/\/|\!|\./, '')
		}
		else if(context.text.match(RegExp(`\\[club${config.groupID}\\|(.*)\\]`, 'i'))) {
			context.text = context.text.replace(RegExp(`\\[(.*)\\|(.*)\\]`, 'i'), '').trim()
		}

		const command = await commands.find(x => x?.words?.test(context.text) || x.payload?.test(context.messagePayload?.button?.toLowerCase()))
		if(command === undefined) {
			if(context.isChat) return
			else {
				return context.reply(`${user.name}, ничего не понял :/`)
			}
		}
		else {
			api.messages.setActivity({ peer_id: context.peerId, type: 'typing' }).catch(console.log)
			context.args = context.text.split(/ |\n/).filter(Boolean)
			command.script(context, {
				fs, fetch, client, query, functions,
				user, config, api, Keyboard
			})
		}
	}
})

// -- Start --
updates.start()
.then(async() => {
	client.connect()
	console.log('[+] Group Bot has been started')
})
.catch(async(error) => {
	console.log(error)
})