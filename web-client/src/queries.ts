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
  query Search($query: String!, $start: Int, $count: Int) {
    search(rawQuery: $query, start: $start, count: $count) {
      graph {
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
      pageInfo {
        start
        count
        total
      }
    }
  }
`;
