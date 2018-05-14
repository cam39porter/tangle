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

const nodeFragment = gql`
  fragment NodeFields on Node {
    id
    type
    text
    level
  }
`;

const edgeFragment = gql`
  fragment EdgeFields on Edge {
    source
    destination
    type
    salience
  }
`;

const graphFragment = gql`
  fragment GraphFields on Graph {
    nodes {
      ...NodeFields
    }
    edges {
      ...EdgeFields
    }
  }
  ${nodeFragment}
  ${edgeFragment}
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

const searchResultsFragment = gql`
  fragment SearchResultsFields on SearchResults {
    list {
      ...ListFields
    }
    graph {
      ...GraphFields
    }
  }
  ${listFragment}
  ${graphFragment}
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
      ...SearchResultsFields
    }
    get(id: $detailId) @include(if: $isDetail) {
      ...GraphFields
    }
  }
  ${searchResultsFragment}
  ${graphFragment}
`;

export const DailyCaptures = gql`
  query DailyCaptures($timezoneOffset: Int!) {
    getAll(useCase: "CAPTURED_TODAY", timezoneOffset: $timezoneOffset) {
      ...SearchResultsFields
    }
  }
  ${searchResultsFragment}
`;

// v2

export const capturedToday = gql`
  query capturedToday($timezoneOffset: Int!) {
    getAll(useCase: "CAPTURED_TODAY", timezoneOffset: $timezoneOffset) {
      ...SearchResultsFields
    }
  }
  ${searchResultsFragment}
`;

export const getDetailed = gql`
  query getDetailed($id: String!) {
    getDetailed(id: $id) {
      ...SearchResultsFields
    }
  }
  ${searchResultsFragment}
`;

export const search = gql`
  query search($rawQuery: String!) {
    search(rawQuery: $rawQuery) {
      ...SearchResultsFields
    }
  }
  ${searchResultsFragment}
`;
