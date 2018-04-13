'use strict'

const { graphql } = require('graphql')
const schema = require("./schema/query")

module.exports.get = (event, context, callback) => {
  graphql(schema, event.queryStringParameters.query)
  .then(
    result => callback(null, { statusCode: 200, body: JSON.stringify(result) }),
    err => callback(err)
  )
}

module.exports.post = (event, context, callback) => {
  graphql(schema, event.body)
  .then(
    result => callback(null, { statusCode: 200, body: JSON.stringify(result) }),
    err => callback(err)
  )
}
