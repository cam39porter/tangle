/*!
 * Type definitions (typeDefs) that are turned into the schema
 */

module.exports = `

schema {
  query: Query
  mutation: Mutation
}

type Query {
  testString: String
}

type Mutation {
  testString(s: String!): String
}


`