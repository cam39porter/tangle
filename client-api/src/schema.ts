/*!
 * Type definitions (typeDefs) that are turned into the schema
 */

export default `

type Capture {
  body: String!
}

schema {
  query: Query
  mutation: Mutation
}

type Query {
  Capture: Capture!
}

type Mutation {
  createCapture(body: String!): Capture!
}

`;
