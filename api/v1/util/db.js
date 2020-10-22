
const sql = require('mssql')
const config = require('../../../config');
var winston = require('./winston');

const poolPromise = new sql.ConnectionPool(config.sql)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', winston.info(err)))

module.exports = {
  sql, poolPromise
}