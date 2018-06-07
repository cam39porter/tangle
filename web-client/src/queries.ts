import gql from "graphql-tag";

// Fragments
export const annotationFragment = gql`
  fragment AnnotationFields on Annotation {
    linkToId
    start
    end
    type
  }
`;

export const reasonFragment = gql`
  fragment ReasonFields on RecommendationReason {
    pivot
    reasonType
  }
`;

export const nodeFragment = gql`
  fragment NodeFields on Node {
    id
    type
    text
    level
  }
`;

export const edgeFragment = gql`
  fragment EdgeFields on Edge {
    source
    destination
    type
    salience
  }
`;

export const graphFragment = gql`
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

export const listFragment = gql`
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

export const searchResultsFragment = gql`
  fragment SearchResultsFields on SearchResults {
    header
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

// Queries
export const capturedToday = gql`
  query capturedToday($timezoneOffset: Int!) {
    getAll(useCase: "CAPTURED_TODAY", timezoneOffset: $timezoneOffset) {
      ...SearchResultsFields
    }
  }
  ${searchResultsFragment}
`;

export const randomCapture = gql`
  query randomCapture {
    getAll(useCase: "RANDOM") {
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

// Mutations
export const createCapture = gql`
  mutation createCapture($body: String!) {
    createCapture(body: $body) {
      ...GraphFields
    }
  }
  ${graphFragment}
`;

export const editCapture = gql`
  mutation editCapture($id: String!, $body: String!) {
    editCapture(id: $id, body: $body)
  }
`;

export const archiveCapture = gql`
  mutation archiveCapture($id: String!) {
    archiveCapture(id: $id)
  }
`;

export const createSession = gql`
  mutation createSession($title: String, $firstCaptureId: String) {
    createSession(title: $title, firstCaptureId: $firstCaptureId) {
      ...NodeFields
    }
  }
  ${nodeFragment}
`;

export const editSession = gql`
  mutation editSession($sessionId: String!, $title: String!) {
    editSession(id: $sessionId, title: $title) {
      ...NodeFields
    }
  }
  ${nodeFragment}
`;

export const createSessionCapture = gql`
  mutation createSessionCapture(
    $body: String!
    $sessionId: String!
    $previousCaptureId: String
  ) {
    createCapture(
      body: $body
      sessionId: $sessionId
      captureRelation: {
        captureId: $previousCaptureId
        relationshipType: PREVIOUS
      }
    ) {
      ...GraphFields
    }
  }
  ${graphFragment}
`;

export const dismissCaptureRelation = gql`
  mutation dismissCaptureRelation($fromId: String!, $toId: String!) {
    dismissCaptureRelation(fromId: $fromId, toId: $toId)
  }
`;
