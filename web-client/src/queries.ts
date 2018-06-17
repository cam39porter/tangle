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

export const pagingInfoFragment = gql`
  fragment PagingInfoFields on PagingInfo {
    nextPageId
    total
  }
`;

export const captureFragment = gql`
  fragment CaptureFields on Capture {
    id
    body
    created
  }
`;

export const sessionItemCollectionFragment = gql`
  fragment SessionItemCollectionFields on SessionItemCollection {
    items {
      ... on Capture {
        ...CaptureFields
      }
    }
    pagingInfo {
      ...PagingInfoFields
    }
  }
  ${captureFragment}
  ${pagingInfoFragment}
`;

export const sessionFragment = gql`
  fragment SessionFields on Session {
    id
    title
    created
    itemCollection {
      ...SessionItemCollectionFields
    }
  }
  ${sessionItemCollectionFragment}
`;

export const sessionCollectionFragment = gql`
  fragment SessionCollectionFields on SessionCollection {
    items {
      id
      title
      created
    }
    pagingInfo {
      ...PagingInfoFields
    }
  }
  ${pagingInfoFragment}
`;

export const captureCollectionFragment = gql`
  fragment CaptureCollectionFields on CaptureCollection {
    items {
      ...CaptureFields
    }
    pagingInfo {
      ...PagingInfoFields
    }
  }
  ${captureFragment}
  ${pagingInfoFragment}
`;

export const searchResultsFragment = gql`
  fragment SearchResultsFields on SearchResults {
    captures {
      ...CaptureCollectionFields
    }
    sessions {
      ...SessionCollectionFields
    }
  }
  ${captureCollectionFragment}
  ${sessionCollectionFragment}
`;

// Queries
export const graphSearch = gql`
  query search($rawQuery: String!, $start: Int!, $count: Int!) {
    search(rawQuery: $rawQuery, start: $start, count: $count) {
      ...SurfaceResultsFields
    }
  }
  ${surfaceResultsFragment}
`;

export const graphGetRecent = gql`
  query getMostRecent($start: Int!, $count: Int!) {
    getMostRecent(start: $start, count: $count) {
      ...SurfaceResultsFields
    }
  }
  ${surfaceResultsFragment}
`;

export const graphGetDetailed = gql`
  query getDetailed($id: String!) {
    getDetailed(id: $id) {
      ...SurfaceResultsFields
    }
  }
  ${surfaceResultsFragment}
`;

export const getRecentSessions = gql`
  query getRecentSessions($pageId: String, $count: Int!) {
    getRecentSessions(pagingContext: { pageId: $pageId, count: $count }) {
      ...SessionCollectionFields
    }
  }
  ${sessionCollectionFragment}
`;

export const getRecentCaptures = gql`
  query getRecentCaptures($pageId: String, $count: Int!) {
    getRecentCaptures(pagingContext: { pageId: $pageId, count: $count }) {
      ...CaptureCollectionFields
    }
  }
  ${captureCollectionFragment}
`;

export const getSession = gql`
  query getSession($sessionId: String!, $pageId: String, $count: Int!) {
    getSession(
      id: $sessionId
      itemsPagingContext: { pageId: $pageId, count: $count }
    ) {
      ...SessionFields
    }
  }
  ${sessionFragment}
`;

export const getRelatedCapturesBySession = gql`
  query getRelatedCapturesBySession(
    $sessionId: String!
    $pageId: String
    $count: Int!
  ) {
    getRelatedCapturesBySession(
      id: $sessionId
      pagingContext: { pageId: $pageId, count: $count }
    ) {
      ...CaptureCollectionFields
    }
  }
  ${captureCollectionFragment}
`;

export const search = gql`
  query searchV2(
    $rawQuery: String!
    $sessionPageId: String
    $sessionCount: Int!
    $capturePageId: String
    $captureCount: Int!
  ) {
    searchV2(
      rawQuery: $rawQuery
      capturePagingContext: { pageId: $capturePageId, count: $captureCount }
      sessionPagingContext: { pageId: $sessionPageId, count: $sessionCount }
    ) {
      ...SearchResultsFields
    }
  }
  ${searchResultsFragment}
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
  mutation editSession($sessionId: String!, $title: String) {
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

export const deleteSession = gql`
  mutation deleteSession($sessionId: String!) {
    deleteSession(id: $sessionId)
  }
`;
