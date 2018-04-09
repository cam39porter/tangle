import gql from "graphql-tag";

// Create a capture
export const CreateCapture = gql`
  mutation CreateCapture($body: String!) {
    createCapture(body: $body) {
      nodes {
        id
        type
        text
      }
      edges {
        source
        destination
        type
        salience
      }
    }
  }
`;

// Search for captures
export const Search = gql`
  query Search(
    $query: String!
    $start: Int
    $count: Int
    $isDetail: Boolean!
    $detailId: String!
  ) {
    search(rawQuery: $query, start: $start, count: $count)
      @skip(if: $isDetail) {
      graph {
        nodes {
          id
          type
          text
          level
        }
        edges {
          source
          destination
          type
          salience
        }
      }
      pageInfo {
        start
        count
        total
      }
    }
    get(id: $detailId) @include(if: $isDetail) {
      nodes {
        id
        type
        text
        level
      }
      edges {
        source
        destination
        type
        salience
      }
    }
  }
`;
