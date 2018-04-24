import gql from "graphql-tag";

//  Login
export const Login = gql`
  mutation Login {
    login
  }
`;

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

// Archive capture
export const ArchiveCapture = gql`
  mutation ArchiveCapture($id: String!) {
    archiveCapture(id: $id)
  }
`;

// Edit capture
export const EditCapture = gql`
  mutation EditCapture($id: String!, $body: String!) {
    editCapture(id: $id, body: $body)
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

export const DailyCaptures = gql`
  query DailyCaptures($timezoneOffset: Int!) {
    getAll(useCase: "CAPTURED_TODAY", timezoneOffset: $timezoneOffset) {
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
        count
        total
        start
      }
    }
  }
`;
