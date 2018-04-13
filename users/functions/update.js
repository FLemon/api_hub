'use strict'

var _ = require('lodash')
const dynamoDb = require('serverless-dynamodb-client').doc
const promisify = require("./promisify")

module.exports = user => promisify(callback => {
  var attributeValues = {}
  var updateExpressions = []
  var updateExpression = ""
  var DbUpdateAttributes = {
    TableName: process.env.USERS_TABLE,
    Key: { email: user.email },
    ReturnValues: "ALL_NEW"
  }

  if (user.firstName) {
    attributeValues[":f"] = user.firstName
    updateExpressions.push("firstName = :f")
  }
  if (user.lastName) {
    attributeValues[":l"] = user.lastName
    updateExpressions.push("lastName = :l")
  }
  if (user.nickName) {
    attributeValues[":n"] = user.nickName
    updateExpressions.push("nickName = :l")
  }
  if (!_.isEmpty(attributeValues)) {
    DbUpdateAttributes["UpdateExpression"] = "SET ".concat(_.join(updateExpressions, ", "))
    DbUpdateAttributes["ExpressionAttributeValues"] = attributeValues
  }
  dynamoDb.update(DbUpdateAttributes, callback)})
  .then(result => result.Attributes)
