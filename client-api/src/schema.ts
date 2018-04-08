/*!
 * Type definitions (typeDefs) that are turned into the schema
 */

export default `
  type Edge {
    source: String!
    destination: String!
    type: EdgeType!
    salience: Float 
  }

  type Graph {
    nodes: [Node!]!
    edges: [Edge!]!
  }

  type Node {
    id: String!
    type: NodeType!
    text: String!
  }

  enum NodeType {
    CAPTURE, 
    ENTITY
  }

  enum EdgeType {
    REFERENCES
  }

  type SearchResults {
    graph: Graph! # for generating the graph visualization,
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
    getCapture(id: String!): Graph!
    search(
      rawQuery: String!
      start: Int = 0
      count: Int = 10
    ): SearchResults!
  }

  type Mutation {
    createCapture(body: String!): Graph!
  }
`;
