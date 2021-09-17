'use strict'

import fs from 'fs'
import fetch from 'node-fetch'

const functions = {
	async collectGames(directory, array) {
		fs.readdir(`./${directory}/`, async(error, result) => {
			for (let count = 0; count < result.length; count ++) {
				const object = await import(`../${directory}/${result[count]}`)
				array.push(object)
			}
		})
	},

	async keycap(int) {
		int = int.toString()
		let text = ``
		for(let i = 0; i < int.length; i++) {
			text += `${int[i]}⃣`
		}
		return text
	},

	async kitcut(text, limit) {
		text = text
		if(text.length <= limit) return text
		text = text.slice(0, limit)
		return text + '...'
	},

	async randomInt(min, max) {
		return min || max ? Math.round(Math.random() * (max - min)) + min : Math.round(Math.random() * min)
	},

	async randomElement(...array) {
		return array[Math.floor(array.length * Math.random())]
	},

	async pretty(int) {
		return int === Infinity || int === undefined || int === null || int === '' ? 0 :
			int.toString().split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('')
	},

	async decl(number, titles) {
		let cases = [2, 0, 1, 1, 1, 2]
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ]
	}
}

export default functions