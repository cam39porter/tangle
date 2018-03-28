import gql from "graphql-tag";

// Create a capture
export const CreateCapture = gql`
  mutation CreateCapture($body: String!) {
    createCapture(body: $body) {
      id
      body
    }
  }
`;

// Search for captures
export const Search = gql`
  query Search($query: String!, $start: Int, $count: Int, $surfaceCount: Int) {
    search(rawQuery: $query, start: $start, count: $count) {
      results {
        body
        id
        tags {
          name
        }
      }
      pageInfo {
        start
        count
        total
      }
    }
    getCaptures(count: $surfaceCount) {
      results {
        body
        id
        tags {
          name
        }
      }
    }
  }
`;
