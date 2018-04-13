'use strict'

const dynamoDb = require('serverless-dynamodb-client').doc
const promisify = require("./promisify")

module.exports = () => promisify(callback =>
  dynamoDb.scan({ TableName: process.env.USERS_TABLE }, callback))
  .then(result => result.Items)

