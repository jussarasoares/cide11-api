const mysql = require('mysql2/promise');

let connection = null
async function connectionDb(configs) {
  connection = await mysql.createConnection(configs)

}
async function query(sql, params) {
  const [rows] = await connection.execute(sql);
  return rows
}

module.exports = {
  connectionDb,
  query
}