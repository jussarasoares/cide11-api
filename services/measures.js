const db = require('./db');

async function getUserMeasures(params){
  const data = await db.query(
    `SELECT * FROM measures WHERE userId = ${params.userId}`
  );

  return {
    data
  }
}

async function getMeasureById(id) {
  const data = await db.query(
    `SELECT * FROM measures WHERE id = ${id}`
  )

  return {
    data
  }
}

async function createMeasure(payload) {
  await db.query(
    `INSERT INTO measures (date, fast, coffee, lunch, dinner, note, userId) VALUES ( "${payload.date}", ${payload.fast}, ${payload.coffee}, ${payload.lunch}, ${payload.dinner}, "${payload.note}", ${payload.userId})`
  )
}

async function updateMeasure(id, payload) {
  await db.query(
    `UPDATE measures SET date="${payload.date}", fast=${payload.fast}, coffee=${payload.coffee}, lunch=${payload.lunch}, dinner=${payload.dinner}, note="${payload.note}", userId=${payload.userId} WHERE id=${id}`
  )
}

async function deleteMeasure(id) {
  await db.query(
    `DELETE FROM measures WHERE id=${id}`
  )
}

module.exports = {
  getUserMeasures,
  getMeasureById,
  createMeasure,
  updateMeasure,
  deleteMeasure
}