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
  query Search($query: String!, $start: Int, $count: Int) {
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
  }
`;
