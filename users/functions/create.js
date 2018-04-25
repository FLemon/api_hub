'use strict'

const dynamoDb = require('serverless-dynamodb-client').doc
const promisify = require("./promisify")

module.exports = user => promisify(callback =>
  dynamoDb.put({ TableName: process.env.USERS_TABLE, Item: user }, callback))
  .then(_ => user)
