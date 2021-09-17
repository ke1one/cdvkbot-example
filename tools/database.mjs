'use strict'

import postgres from 'pg'
import config from './config.mjs'
export const client = new postgres.Pool({
	connectionString: config.databaseLink,
	ssl: { rejectUnauthorized: false }
})

export async function query(query, values) {
	let result = typeof values == 'object' ? await client.query({ text: query, values }) : await client.query({ text: query })
	return result.rows
}