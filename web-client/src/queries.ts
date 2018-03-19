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

// Get all captures
export const GetCaptures = gql`
  query GetCaptures {
    getCaptures {
      body
      id
    }
  }
`;

// Search for captures
export const Search = gql`
  query Search($query: String!) {
    search(rawQuery: $query) {
      results {
        body
        id
      }
    }
  }
`;
