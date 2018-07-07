// GraphQL
import {
  sessionCollectionFragment,
  surfaceResultsFragment,
  sessionItemCollectionFragment,
  captureCollectionFragment,
  sessionFragment,
  graphGetRecent,
  graphSearch,
  graphGetDetailed,
  getRelatedCapturesBySession
} from "../queries";

// Utils
import { remove, assign } from "lodash";
import { NetworkUtils } from "../utils";
import config from "../cfg";

// Types
import { MutationUpdaterFn } from "apollo-client";
import {
  CaptureFieldsFragment,
  NodeFieldsFragment,
  SessionFieldsFragment,
  SessionCollectionFieldsFragment,
  SessionItemCollectionFieldsFragment,
  SurfaceResultsFieldsFragment,
  CaptureCollectionFieldsFragment
} from "../__generated__/types";
import { DataProxy } from "apollo-cache";

// Apollo Read Fragments
const SESSION_COLLECTION_READ_FRAGMENT = {
  id: "SessionCollection",
  fragment: sessionCollectionFragment,
  fragmentName: "SessionCollectionFields"
};

const SURFACE_RESULTS_READ_FRAGMENT = {
  id: "SurfaceResults",
  fragment: surfaceResultsFragment,
  fragmentName: "SurfaceResultsFields"
};

const CAPTURE_COLLECTION_READ_FRAGMENT = {
  id: "CaptureCollection",
  fragment: captureCollectionFragment,
  fragmentName: "CaptureCollectionFields"
};

const SESSION_ITEM_COLLECTION_READ_FRAGMENT = {
  id: "SessionItemCollection",
  fragment: sessionItemCollectionFragment,
  fragmentName: "SessionItemCollectionFields"
};

const SESSION_READ_FRAGMENT_NO_ID = {
  fragment: sessionFragment,
  fragmentName: "SessionFields"
};

// Create Capture Queries to Refetch
const getCreateSessionCaptureRefetchQueries = (
  path: string,
  search: string,
  sessionId: string
) => {
  switch (path) {
    case "/search":
      return [
        {
          query: graphSearch,
          variables: {
            rawQuery: NetworkUtils.getQuery(search),
            start: 0,
            count: config.resultCount
          }
        }
      ];
    case "/recent":
      return [
        {
          query: graphGetRecent,
          variables: {
            start: 0,
            count: config.resultCount
          }
        }
      ];
    default:
      return [
        {
          query: getRelatedCapturesBySession,
          variables: {
            sessionId: sessionId,
            pagingInfo: null,
            count: config.resultCount
          }
        },
        {
          query: graphGetDetailed,
          variables: {
            id: sessionId
          }
        }
      ];
  }
};

// Create Session Capture Update
const createSessionCaptureUpdate = (store, { data }) => {
  let captureNode = data && (data["createCapture"] as NodeFieldsFragment);

  if (!captureNode) {
    return;
  }

  const captureItem = {
    __typename: "Capture",
    id: captureNode.id,
    created: Date.now(),
    body: captureNode.text || "",
    parents: captureNode.parents
  } as CaptureFieldsFragment;

  // SessionItemsCollection
  let sessionItemCollection: SessionItemCollectionFieldsFragment | null = store.readFragment(
    {
      id: "SessionItemCollection",
      fragment: sessionItemCollectionFragment,
      fragmentName: "SessionItemCollectionFields"
    }
  );

  if (sessionItemCollection && sessionItemCollection.items) {
    sessionItemCollection.items.push(captureItem);
    store.writeFragment({
      id: "SessionItemCollection",
      fragment: sessionItemCollectionFragment,
      fragmentName: "SessionItemCollectionFields",
      data: {
        __typename: "SessionItemCollection",
        items: sessionItemCollection.items,
        pagingInfo: sessionItemCollection.pagingInfo
      }
    });
  }
};

// Update Delete Session
const deleteSessionUpdate: (
  sessionId: String
) => MutationUpdaterFn = sessionId => {
  return store => {
    // SessionCollection
    let sessionCollection: SessionCollectionFieldsFragment | null = store.readFragment(
      SESSION_COLLECTION_READ_FRAGMENT
    );
    if (sessionCollection && sessionCollection.items) {
      store.writeFragment(
        assign(SESSION_COLLECTION_READ_FRAGMENT, {
          data: {
            __typename: "SessionCollection",
            items: sessionCollection.items.filter(
              session => session.id !== sessionId
            ),
            pagingInfo: sessionCollection.pagingInfo
          }
        })
      );
    }

    // SurfaceResults
    const surfaceResults: SurfaceResultsFieldsFragment | null = store.readFragment(
      SURFACE_RESULTS_READ_FRAGMENT
    );
    if (surfaceResults && surfaceResults.graph) {
      remove(surfaceResults.graph.nodes, node => node.id === sessionId);
      remove(
        surfaceResults.graph.edges,
        edge => edge.source === sessionId || edge.destination === sessionId
      );
      store.writeFragment(
        assign(SURFACE_RESULTS_READ_FRAGMENT, {
          data: {
            __typename: "SurfaceResults",
            ...surfaceResults
          }
        })
      );
    }
  };
};

// Edit Session Update
const editSessionUpdate: (
  sessionId: String,
  title: String
) => MutationUpdaterFn = (sessionId, title) => {
  return store => {
    // SessionCollection
    let sessionCollection: SessionCollectionFieldsFragment | null = store.readFragment(
      SESSION_COLLECTION_READ_FRAGMENT
    );
    if (sessionCollection && sessionCollection.items) {
      store.writeFragment(
        assign(SESSION_COLLECTION_READ_FRAGMENT, {
          data: {
            __typename: "SessionCollection",
            items: sessionCollection.items.map(session => {
              if (session.id !== sessionId) {
                return session;
              }
              return assign(session, { title });
            }),
            pagingInfo: sessionCollection.pagingInfo
          }
        })
      );
    }

    // Session
    let sessionReadFragment = assign(SESSION_READ_FRAGMENT_NO_ID, {
      id: sessionId
    }) as DataProxy.Fragment;
    let currentSession: SessionFieldsFragment | null = store.readFragment(
      sessionReadFragment
    );
    if (currentSession) {
      store.writeFragment(
        assign(sessionReadFragment, {
          data: assign(currentSession, { title })
        })
      );
    }
  };
};

// Delete Capture Update
const deleteCaptureUpdate: (
  captureId: String
) => MutationUpdaterFn = captureId => {
  return store => {
    // Capture Collection
    let captureCollection: CaptureCollectionFieldsFragment | null = store.readFragment(
      CAPTURE_COLLECTION_READ_FRAGMENT
    );
    if (captureCollection) {
      store.writeFragment(
        assign(CAPTURE_COLLECTION_READ_FRAGMENT, {
          data: {
            __typename: "CaptureCollection",
            items: captureCollection.items.filter(
              capture => capture.id !== captureId
            ),
            pagingInfo: captureCollection.pagingInfo
          }
        })
      );
    }

    // SessionItemsCollection
    let sessionItemCollection: SessionItemCollectionFieldsFragment | null = store.readFragment(
      SESSION_ITEM_COLLECTION_READ_FRAGMENT
    );
    if (sessionItemCollection && sessionItemCollection.items) {
      store.writeFragment(
        assign(SESSION_ITEM_COLLECTION_READ_FRAGMENT, {
          data: {
            __typename: "SessionItemCollection",
            items: sessionItemCollection.items.filter(
              capture => capture.id !== captureId
            ),
            pagingInfo: sessionItemCollection.pagingInfo
          }
        })
      );
    }

    // SurfaceResults
    const surfaceResults: SurfaceResultsFieldsFragment | null = store.readFragment(
      SURFACE_RESULTS_READ_FRAGMENT
    );
    if (surfaceResults && surfaceResults.graph) {
      remove(surfaceResults.graph.nodes, node => node.id === captureId);
      remove(
        surfaceResults.graph.edges,
        edge => edge.source === captureId || edge.destination === captureId
      );
      store.writeFragment(
        assign(SURFACE_RESULTS_READ_FRAGMENT, {
          data: {
            __typename: "SurfaceResults",
            ...surfaceResults
          }
        })
      );
    }
  };
};

export default {
  getCreateSessionCaptureRefetchQueries,
  createSessionCaptureUpdate,
  deleteSessionUpdate,
  editSessionUpdate,
  deleteCaptureUpdate
};
