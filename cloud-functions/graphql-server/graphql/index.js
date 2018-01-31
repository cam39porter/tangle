/*!
 * GraphQL Express Server
 */

const { graphqlExpress } = require('apollo-server-express')
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')

const schema = require('./schema.js')
const mocks = require('./test/mocks')

/*!
 * Make the schema executable
 */

const executableSchema = makeExecutableSchema({ 
  typeDefs: schema,
  // resolvers: resolvers
 })

 addMockFunctionsToSchema({
   schema: executableSchema,
   mocks: mocks
 })

/*!
 * Export the GraphQL Express Server
 */

module.exports = graphqlExpress({ 
  schema: executableSchema
 })