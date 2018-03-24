/*!
 * Type definitions (typeDefs) that are turned into the schema
 */

export default `

type CaptureCollection {
  results: [Capture!]!
  pageInfo: PageInfo
}

type Capture {
  id: String!
  body: String!
  created: String!
}

type PageInfo {
  start: Int!
  count: Int!
  total: Int!
}

schema {
  query: Query
  mutation: Mutation
}

type Query {
  getCapture(id: String!): Capture!,
  getCaptures(start: Int = 0, count: Int = 10): CaptureCollection!
  search(rawQuery: String!, start: Int = 0, count: Int = 10): CaptureCollection!
}

type Mutation {
  createCapture(body: String!): Capture!
}

`;
