import gql from "graphql-tag";

// Fragments
const annotationFragment = gql`
  fragment AnnotationFields on Annotation {
    start
    end
    type
  }
`;

const reasonFragment = gql`
  fragment ReasonFields on RecommendationReason {
    pivot
    reasonType
  }
`;

const graphFragment = gql`
  fragment GraphFields on Graph {
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
`;

const listFragment = gql`
  fragment ListFields on ListItem {
    id
    text {
      text
      annotations {
        ...AnnotationFields
      }
    }
    reasons {
      ...ReasonFields
    }
    relatedItems {
      id
      text {
        text
        annotations {
          ...AnnotationFields
        }
      }
      reasons {
        ...ReasonFields
      }
    }
  }
  ${annotationFragment}
  ${reasonFragment}
`;

// Create a capture
export const CreateCapture = gql`
  mutation CreateCapture($body: String!) {
    createCapture(body: $body) {
      ...GraphFields
    }
  }
  ${graphFragment}
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
        ...GraphFields
      }
      list {
        ...ListFields
      }
    }
    get(id: $detailId) @include(if: $isDetail) {
      ...GraphFields
    }
  }
  ${graphFragment}
  ${listFragment}
`;

export const DailyCaptures = gql`
  query DailyCaptures($timezoneOffset: Int!) {
    getAll(useCase: "CAPTURED_TODAY", timezoneOffset: $timezoneOffset) {
      graph {
        ...GraphFields
      }
      list {
        ...ListFields
      }
    }
  }
  ${graphFragment}
  ${listFragment}
`;
