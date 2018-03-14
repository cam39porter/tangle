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
