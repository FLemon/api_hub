'use strict'

const { GraphQLString, GraphQLObjectType, GraphQLNonNull } = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'user',
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    nickName: { type: GraphQLString }
  }
})
