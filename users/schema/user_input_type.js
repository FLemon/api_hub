'use strict'

const { GraphQLString, GraphQLInputObjectType } = require('graphql')

module.exports = new GraphQLInputObjectType({
  name: 'userInput',
  fields: {
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    nickName: { type: GraphQLString }
  }
})
