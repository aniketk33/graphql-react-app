'use strict'

const mysql = require('mysql2/promise')

module.exports.getDbConnection = async () => {
  try {
      const dbConnection = await mysql.createConnection({
        host: 'mysql_server',
        user: 'root',
        password: 'root123',
        database: 'covid_19_stats',
        connectTimeout: 60000
      })
      console.log('DB Connected successfully');
      return dbConnection
  } catch (error) {
    console.log('Connection error');
    throw error
  }
}
