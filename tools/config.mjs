'use strict'
import process from 'dotenv'
let env = process.config(),
{ GROUP_TOKEN, GROUP_ID, DATABASE_LINK } = env.parsed

const keys = {
	groupToken: GROUP_TOKEN,
	groupID: GROUP_ID,
	databaseLink: DATABASE_LINK,
	setting: { createDatabase: true }
}

export default keys