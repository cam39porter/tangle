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

export const surfaceResultsFragment = gql`
  fragment SurfaceResultsFields on SurfaceResults {
    pivot {
      ...NodeFields
    }
    list {
      ...ListFields
    }
    graph {
      ...GraphFields
    }
  }
  ${nodeFragment}
  ${listFragment}
  ${graphFragment}
`;

// Queries
export const mostRecent = gql`
  query getMostRecent($start: Int!, $count: Int!) {
    getMostRecent(start: $start, count: $count) {
      ...SurfaceResultsFields
    }
  }
  ${surfaceResultsFragment}
`;

export const randomCapture = gql`
  query randomCapture {
    getAll(useCase: "RANDOM") {
      ...SurfaceResultsFields
    }
  }
  ${surfaceResultsFragment}
`;

export const getDetailed = gql`
  query getDetailed($id: String!) {
    getDetailed(id: $id) {
      ...SurfaceResultsFields
    }
  }
  ${surfaceResultsFragment}
`;

export const search = gql`
  query search($rawQuery: String!, $start: Int!, $count: Int!) {
    search(rawQuery: $rawQuery, start: $start, count: $count) {
      ...SurfaceResultsFields
    }
  }
  ${surfaceResultsFragment}
`;

// Mutations
export const createCapture = gql`
  mutation createCapture($body: String!) {
    createCapture(body: $body) {
      ...NodeFields
    }
  }
  ${nodeFragment}
`;

export const editCapture = gql`
  mutation editCapture($id: String!, $body: String!) {
    editCapture(id: $id, body: $body) {
      ...NodeFields
    }
  }
  ${nodeFragment}
`;

export const archiveCapture = gql`
  mutation archiveCapture($id: String!) {
    archiveCapture(id: $id) {
      ...NodeFields
    }
  }
  ${nodeFragment}
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
      ...NodeFields
    }
  }
  ${nodeFragment}
`;

export const dismissCaptureRelation = gql`
  mutation dismissCaptureRelation($fromId: String!, $toId: String!) {
    dismissCaptureRelation(fromId: $fromId, toId: $toId)
  }
`;
