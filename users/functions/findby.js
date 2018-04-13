'use strict'

const dynamoDb = require('serverless-dynamodb-client').doc
const promisify = require("./promisify")

module.exports = email => promisify(callback =>
  dynamoDb.get({ TableName: process.env.USERS_TABLE, Key: { email } }, callback))
  .then(result => result.Item)
