const db = require('./db');

async function getUserById(id) {
  const data = await db.query(
    `SELECT * FROM users WHERE id = ${id}`
  )

  return {
    data
  }
}

async function getUserLogin(email, password) {
  const data = await db.query(
    `SELECT * FROM users WHERE email="${email}" AND password="${password}"`
  )

  return {
    data
  }
}

async function createUser(payload) {
  return await db.query(
    `INSERT INTO users (name, email, password) VALUES ( "${payload.name}", "${payload.email}", "${payload.password}")`
  )
}

async function updateUser(id, payload) {
  await db.query(
    `UPDATE users SET name="${payload.name}", email="${payload.email}", password="${payload.pasword}" WHERE id=${id}`
  )
}


module.exports = {
  getUserById,
  getUserLogin,
  createUser,
  updateUser
}