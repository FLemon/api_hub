'use strict';

var _ = require('lodash')

const dynamoDb = require('serverless-dynamodb-client').doc
const {
  graphql, GraphQLSchema, GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLNonNull,
  GraphQLList
} = require('graphql')
const tableName = process.env.USERS_TABLE

const promisify = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if (error) {
      console.log(`error: ${error}`)
      reject(error)
    } else {
      resolve(result)
    }
  })
})

const userType = new GraphQLObjectType({
  name: 'user',
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    nickName: { type: GraphQLString }
  }
})

const userInputType = new GraphQLInputObjectType({
  name: 'userInput',
  fields: {
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    nickName: { type: GraphQLString }
  }
})


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      findBy: {
        args: { email: { name: 'email', type: new GraphQLNonNull(GraphQLString) } },
        type: userType,
        resolve: (parent, args) => findBy(args.email)
      },
      list: {
        type: new GraphQLList(userType),
        resolve: (parent, args) => list()
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      create: {
        args: { email: { name: 'email', type: new GraphQLNonNull(GraphQLString) } },
        type: userType,
        resolve: (parent, args) => create(args.email)
      },
      update: {
        args: { user: { type: userInputType } },
        type: userType,
        resolve: (parent, { user }) => update(user)
      }
    }
  })
})

const update = user => promisify(callback => {
  var attributeValues = {}
  var updateExpressions = []
  var updateExpression = ""

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
    updateExpression = "SET ".concat(_.join(updateExpressions, ", "))
    console.log(updateExpression)
  }
  dynamoDb.update({
    TableName: tableName,
    Key: { email: user.email },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: attributeValues,
    ReturnValues: "ALL_NEW"
  }, callback)})
  .then(result => {
    console.log(result.Attributes)
    return result.Attributes
  })

const list = () => promisify(callback =>
  dynamoDb.scan({ TableName: tableName }, callback))
  .then(result => result.Items)

const create = user => promisify(callback =>
  dynamoDb.put({ TableName: tableName, Item: { user } }, callback))
  .then(result => result.Item)

const findBy = email => promisify(callback =>
  dynamoDb.get({ TableName: tableName, Key: { email } }, callback))
  .then(result => result.Item)

module.exports.queries = (event, context, callback) => {
  graphql(schema, event.body)
  .then(
    result => callback(null, { statusCode: 200, body: JSON.stringify(result) }),
    err => callback(err)
  )
}
