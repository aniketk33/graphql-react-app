'use strict'

const mysql = require('mysql2/promise')

module.exports.getDbConnection = async () => {
  try {
      const dbConnection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root123',
        database: 'covid_19_stats',
        connectTimeout: 60000
      })
      return dbConnection
  } catch (error) {
    throw error
  }
}
