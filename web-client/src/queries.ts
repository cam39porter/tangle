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
    resultClass
    parents {
      id
      title
      created
    }
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

export const surfaceResultsFragment = gql`
  fragment SurfaceResultsFields on SurfaceResults {
    pivot {
      ...NodeFields
    }
    graph {
      ...GraphFields
    }
  }
  ${nodeFragment}
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
    lastModified
    authorName
    parents {
      id
      title
      created
    }
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

export const sessionWithoutItemCollectionFragment = gql`
  fragment SessionWithoutItemCollectionFields on Session {
    id
    title
    created
    lastModified
  }
`;

export const sessionFragment = gql`
  fragment SessionFields on Session {
    id
    title
    body
    created
    lastModified
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
      lastModified
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

export const getSettings = gql`
  query getSettings {
    getSettings {
      storageUsed
    }
  }
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

export const deleteCapture = gql`
  mutation deleteCapture($id: String!) {
    deleteCapture(id: $id)
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
  mutation editSession($sessionId: String!, $title: String, $body: String) {
    editSession(id: $sessionId, title: $title, body: $body) {
      ...NodeFields
    }
  }
  ${nodeFragment}
`;

export const createSessionCapture = gql`
  mutation createSessionCapture(
    $body: String!
    $sessionId: String!
    $previousId: String
  ) {
    createCapture(body: $body, sessionId: $sessionId, previousId: $previousId) {
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

export const reportError = gql`
  mutation reportError($message: String, $stacktrace: String) {
    reportError(message: $message, stacktrace: $stacktrace)
  }
`;

export const sendFeedback = gql`
  mutation sendFeedback($body: String!) {
    sendFeedback(body: $body)
  }
`;
