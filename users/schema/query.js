'use strict'

const {
  graphql, GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList
} = require('graphql')
const userInputType = require("./user_input_type")
const userType = require("./user_type")
const create = require("../functions/create")
const update = require("../functions/update")
const findBy = require("../functions/findby")
const list = require("../functions/list")

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      findby: {
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
