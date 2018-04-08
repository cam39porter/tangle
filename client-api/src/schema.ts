/*!
 * Type definitions (typeDefs) that are turned into the schema
 */

export default `
  type Edge {
    source: String!
    destination: String!
    weight: Float # number corresponding to the relevancy of the edge
  }

  type Graph {
    captures: [Capture!]!
    entities: [Entity!]!
    edges: [Edge!]!
  }

  type Capture {
    id: String!
    body: String!
    created: String!
    tags: [Tag!]!
  }

  type Entity {
    id: String!
    name: String!
    type: String! # from NLP API
  }

  type Tag {
    name: String!
  }

  type SearchResults {
    graph: Graph! # for generating the graph visualization,
    pageInfo: PageInfo
  }

  type CaptureCollection {
    results: [Capture!]!
    pageInfo: PageInfo
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
    getCapture(id: String!): Capture!
    getCaptures(start: Int = 0, count: Int = 10): CaptureCollection!
    search(
      rawQuery: String!
      start: Int = 0
      count: Int = 10
    ): CaptureCollection!
    searchv2(rawQuery: String!, start: Int = 0, count: Int = 10): SearchResults
  }

  type Mutation {
    createCapture(body: String!): Graph!
  }
`;
