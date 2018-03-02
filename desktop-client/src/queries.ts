import gql from "graphql-tag";

export const CreateCapture = gql`
  mutation CreateCapture($body: String!) {
    createCapture(body: $body) {
      id
      body
    }
  }
`;
