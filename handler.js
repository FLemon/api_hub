'use strict';

const dbClient = require('serverless-dynamodb-client')
const dynamoDb = dbClient.doc
const schema = require('/users/schema')

const promisify = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if (error) {
      reject(error)
    } else {
      resolve(result)
    }
  })
})


const findBy = firstName => promisify(callback =>
  dynamoDb.get({
    TableName: process.env.DYNAMODB_TABLE,
    Key: { firstName }
  }, callback))
  .then((result) => {
    if(!result.Item) {
      return "not found"
    }
    return `Hello ${result.Item.firstName}`
  })

module.exports.users = (event, context, callback) => {
  console.log(event.queryStringParameters, event.queryStringParameters.query)
  graphql(schema, event.queryStringParameters.query)
  .then(
    result => callback(null, { statusCode: 200, body: JSON.stringify(result) }),
    err => callback(err)
  )
}
