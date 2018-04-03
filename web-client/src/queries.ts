import gql from "graphql-tag";

// Create a capture
export const CreateCapture = gql`
  mutation CreateCapture($body: String!) {
    createCapture(body: $body) {
      captures {
        id
        body
        created
        tags {
          name
        }
      }
      entities {
        id
        name
        type
      }
      edges {
        source
        destination
      }
    }
  }
`;

// Search for captures
export const Search = gql`
  query Search($query: String!, $start: Int, $count: Int, $surfaceCount: Int) {
    searchv2(rawQuery: $query, start: $start, count: $count) {
      graph {
        captures {
          id
          body
          created
          tags {
            name
          }
        }
        entities {
          id
          name
          type
        }
        edges {
          source
          destination
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
