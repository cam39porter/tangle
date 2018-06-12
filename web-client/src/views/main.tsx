// React
import * as React from "react";

// GraphQL
import {
  // Most Recent
  getMostRecentQuery as getMostRecentResponse,
  getMostRecentQueryVariables,
  // Random
  randomCaptureQuery as randomCaptureResponse,
  // Search
  searchQuery as searchResponse,
  searchQueryVariables,
  // Detailed
  getDetailedQuery as getDetailedResponse,
  getDetailedQueryVariables,
  // Create Session
  createSessionMutation as createSessionResponse,
  // Create Session Capture
  createSessionCaptureMutation as createSessionCaptureResponse,
  createSessionCaptureMutationVariables,
  // Edit Session
  editSessionMutation as editSessionResponse,
  editSessionMutationVariables,
  // Create Capture
  createCaptureMutation as createCaptureResponse,
  createCaptureMutationVariables,
  // Archive Capture
  archiveCaptureMutation as archiveCaptureResponse,
  archiveCaptureMutationVariables,
  // Edit Capture
  editCaptureMutation as editCaptureResponse,
  editCaptureMutationVariables,
  // Dismiss Capture Relation
  dismissCaptureRelationMutation as dismissCaptureRelationResponse,
  dismissCaptureRelationMutationVariables,
  // Extra
  SurfaceResultsFieldsFragment,
  ListFieldsFragment,
  NodeType,
  NodeFieldsFragment
} from "../__generated__/types";
import {
  // Queries
  mostRecent,
  randomCapture,
  search,
  getDetailed,
  // Mutations
  createSession,
  createSessionCapture,
  editSession,
  createCapture,
  archiveCapture,
  editCapture,
  dismissCaptureRelation,
  // Fragments
  surfaceResultsFragment
} from "../queries";
import { graphql, compose, QueryProps, MutationFunc } from "react-apollo";

// Router
import { RouteComponentProps } from "react-router";

// Components
import List from "../components/list";
import GraphVisualization from "../components/graph-visualization";
import MenuBar from "../components/menu-bar";
import Navigation from "../components/navigation";
import ListSessionHeader from "../components/list-session-header";
import ListHeaderCapture from "../components/list-capture-header";
import InputSurface from "../components/input-surface";
import InputCapture from "../components/input-capture";
import ReactResizeDetector from "react-resize-detector";

// Utils
import { WindowUtils, NetworkUtils } from "../utils";
import { noop, trim, assign, reverse, remove } from "lodash";
import windowSize from "react-window-size";

// Constants
const DEFAULT_LIST_LENGTH = 5;

// Types
import { Location } from "../types";

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  // Queries
  mostRecent?: QueryProps<getMostRecentQueryVariables> &
    Partial<getMostRecentResponse>;
  randomCapture?: QueryProps<{}> & Partial<randomCaptureResponse>;
  search?: QueryProps<searchQueryVariables> & Partial<searchResponse>;
  getDetailed?: QueryProps<getDetailedQueryVariables> &
    Partial<getDetailedResponse>;
  // Mutations
  createSession: MutationFunc<createSessionResponse, {}>;
  editSession: MutationFunc<editSessionResponse, editSessionMutationVariables>;
  createSessionCapture: MutationFunc<
    createSessionCaptureResponse,
    createSessionCaptureMutationVariables
  >;
  createCapture: MutationFunc<
    createCaptureResponse,
    createCaptureMutationVariables
  >;
  archiveCapture: MutationFunc<
    archiveCaptureResponse,
    archiveCaptureMutationVariables
  >;
  editCapture: MutationFunc<editCaptureResponse, editCaptureMutationVariables>;
  dismissCaptureRelation: MutationFunc<
    dismissCaptureRelationResponse,
    dismissCaptureRelationMutationVariables
  >;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface CaptureState {
  isShowingRelated: boolean;
}

interface State {
  listHeaderHeight: number;
  // Header
  isSearching: boolean;
  surfaceText: string;
  // Captures
  captures: Map<string, CaptureState>;
  scrollToId?: string;
  // Session
  sessionId?: string;
  // GraphQL
  isLoading: boolean;
  data: SurfaceResultsFieldsFragment | null;
  header: string | null;
  pivot: NodeFieldsFragment | null;
}

// Class
class Main extends React.Component<Props, State> {
  numberOfCallsToFetchMore = 0; // track the number of times more items are requested

  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      listHeaderHeight: 0,
      isSearching:
        NetworkUtils.getCurrentLocation(nextProps.location.search) ===
        Location.MostRecent,
      surfaceText: NetworkUtils.getQuery(nextProps.location.search),
      captures: new Map<string, CaptureState>(),
      sessionId: NetworkUtils.getIsSessionId(nextProps.location.search),
      // GraphQL
      isLoading: true,
      data: null,
      header: null,
      pivot: null
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    let isLoading: boolean = true;
    let data: SurfaceResultsFieldsFragment | null = null;
    let header: string | null = null;
    let pivot: NodeFieldsFragment | null = null;

    // Most Recent
    if (nextProps.mostRecent) {
      isLoading = nextProps.mostRecent.loading;
      data = nextProps.mostRecent.getMostRecent
        ? nextProps.mostRecent.getMostRecent
        : null;
      header = "Most recent captures";
    }

    // Search
    if (nextProps.search) {
      isLoading = nextProps.search.loading;
      data = nextProps.search.search ? nextProps.search.search : null;
      header = `Search results for "${NetworkUtils.getQuery(
        nextProps.location.search
      )}"`;
    }

    // Random
    if (nextProps.randomCapture) {
      isLoading = nextProps.randomCapture.loading;
      data = nextProps.randomCapture.getAll
        ? nextProps.randomCapture.getAll
        : null;
      header = "Focusing on the random capture below";
    }

    // Detailed
    if (nextProps.getDetailed) {
      isLoading = nextProps.getDetailed.loading;
      data = nextProps.getDetailed.getDetailed
        ? nextProps.getDetailed.getDetailed
        : null;
      pivot =
        nextProps.getDetailed.getDetailed &&
        nextProps.getDetailed.getDetailed.pivot
          ? nextProps.getDetailed.getDetailed.pivot
          : null;

      if (pivot) {
        switch (pivot.type) {
          case NodeType.Entity:
            header = `Focusing on "${pivot.text}"`;
            pivot = null;
            break;
          case NodeType.Tag:
            header = `Focusing on "#${pivot.text}"`;
            pivot = null;
            break;
          case NodeType.Session:
            let length = data && data.list.length;
            if (length) {
              header = `${length} capture${
                length > 1 ? "s" : ""
              } in this brainstorm`;
            } else {
              header = `Capture your first thought!`;
            }
            break;
          default:
            header = `Focusing on the capture below`;
        }
      }
    }

    // Set loading state
    header = isLoading ? "Loading..." : header;

    const sessionId = NetworkUtils.getIsSessionId(nextProps.location.search);

    let nextState = {
      isSearching:
        NetworkUtils.getCurrentLocation(nextProps.location.search) !==
        Location.MostRecent,
      surfaceText: NetworkUtils.getQuery(nextProps.location.search),
      sessionId,
      // GraphQL
      isLoading,
      data,
      header,
      pivot
    };

    this.setState(nextState);
  }

  createCaptureState = (): CaptureState => {
    let captureState = {
      isShowingRelated: true
    };

    return captureState;
  };

  optimisticUpdateOnCapture = (
    dataProxy,
    resultData: { data: { createCapture: NodeFieldsFragment } }
  ) => {
    const optimisticResponse = resultData.data.createCapture;

    // only update for optimistic response
    if (optimisticResponse.id.split(":")[0] !== "optimistic") {
      return;
    }

    const cacheData: SurfaceResultsFieldsFragment | null = dataProxy.readFragment(
      {
        id: "SurfaceResults",
        fragment: surfaceResultsFragment,
        fragmentName: "SurfaceResultsFields"
      }
    );
    if (!(cacheData && cacheData.list && cacheData.graph)) {
      return;
    }
    let tempListItem = {
      __typename: "ListItem",
      id: optimisticResponse.id,
      text: {
        __typename: "AnnotatedText",
        text: optimisticResponse.text,
        annotations: []
      },
      reasons: [],
      relatedItems: []
    } as ListFieldsFragment;
    let tempList = reverse(cacheData.list);
    tempList.push(tempListItem);
    let tempNode: NodeFieldsFragment = optimisticResponse;
    cacheData.list = reverse(tempList);
    cacheData.graph.nodes.push(tempNode);
    dataProxy.writeFragment({
      id: "SurfaceResults",
      fragment: surfaceResultsFragment,
      fragmentName: "SurfaceResultsFields",
      data: cacheData
    });
  };

  render() {
    let isLoading = this.state.isLoading;
    let data = this.state.data;
    let header = this.state.header;
    let pivot = this.state.pivot;
    let refetch;
    let fetchMore;

    // Most Recent
    if (this.props.mostRecent) {
      refetch = this.props.mostRecent.refetch;
      fetchMore = this.state.isLoading
        ? undefined
        : this.props.mostRecent.fetchMore;
    }

    // Search
    if (this.props.search) {
      refetch = this.props.search.refetch;
      fetchMore = this.state.isLoading
        ? undefined
        : this.props.search.fetchMore;
    }

    // Random
    if (this.props.randomCapture) {
      refetch = this.props.randomCapture.refetch;
    }

    // Detailed
    if (this.props.getDetailed) {
      refetch = this.props.getDetailed.refetch;
    }

    let isLargeWindow = WindowUtils.getIsLargeWindow(this.props.windowWidth);

    return (
      <div className={`flex w-100 vh-100`}>
        {/* Sidebar */}
        <div
          className={`shadow-3 bg-light-gray z-5`}
          style={{
            width: isLargeWindow ? "32.5em" : "100%"
          }}
        >
          {/* Header */}
          <div>
            <ReactResizeDetector
              handleHeight={true}
              onResize={(_, height) => {
                this.setState({
                  listHeaderHeight: height
                });
              }}
            />

            {/* Search Bar */}
            {!this.state.sessionId && (
              <div className={`pt4 bg-accent`}>
                <div className={`mh4`}>
                  <InputSurface
                    handleSurface={text => {
                      let query = trim(text);
                      if (!query) {
                        return;
                      }
                      this.props.history.push(
                        `?query=${encodeURIComponent(text)}`
                      );
                    }}
                    startingHTML={NetworkUtils.getQuery(
                      this.props.location.search
                    )}
                  />
                </div>
              </div>
            )}

            {/* Capture Header */}
            {!this.state.sessionId && (
              <div className={`pt4 bg-accent`}>
                <ListHeaderCapture
                  handleCapture={text => {
                    this.props
                      .createCapture({
                        variables: {
                          body: text
                        },
                        optimisticResponse: {
                          createCapture: {
                            __typename: "Node",
                            id: `optimistic:${NetworkUtils.getRandomId()}`,
                            type: NodeType.Capture,
                            text: text,
                            level: 0
                          } as NodeFieldsFragment
                        },
                        update: this.optimisticUpdateOnCapture
                      })
                      .then(() => {
                        refetch();
                      })
                      .catch(err => console.error(err));
                  }}
                />
              </div>
            )}

            {/* Session Title / Tags */}
            {!isLoading &&
              this.state.sessionId && (
                <div className={`shadow-5`}>
                  <ListSessionHeader
                    startingTitle={pivot ? pivot.text || undefined : undefined}
                    handleEditTitle={title => {
                      if (!this.state.sessionId) {
                        return;
                      }
                      this.props
                        .editSession({
                          variables: {
                            sessionId: this.state.sessionId,
                            title: title === "" ? null : title
                          }
                        })
                        .catch(err => console.error(err));
                    }}
                    handleClose={() => {
                      if (this.props.history.length > 2) {
                        this.props.history.goBack();
                      } else {
                        this.props.history.push("/");
                      }
                    }}
                  />

                  {/* Session Capture */}
                  <div className={`ph3 pv4 bt bb b--light-gray bg-white`}>
                    <InputCapture
                      handleCapture={text => {
                        if (!this.state.sessionId) {
                          return;
                        }

                        let previousCaptureId;

                        if (
                          this.props.getDetailed &&
                          this.props.getDetailed.getDetailed
                        ) {
                          let list = this.props.getDetailed.getDetailed.list;

                          if (list.length > 0) {
                            let previousCapture = list[
                              list.length - 1
                            ] as ListFieldsFragment;
                            previousCaptureId = previousCapture.id;
                          }
                        }

                        this.props
                          .createSessionCapture({
                            variables: {
                              body: text,
                              sessionId: this.state.sessionId,
                              previousCaptureId: previousCaptureId
                                ? previousCaptureId
                                : this.state.sessionId
                            },
                            optimisticResponse: {
                              createCapture: {
                                __typename: "Node",
                                id: `optimistic:${NetworkUtils.getRandomId()}`,
                                type: NodeType.Capture,
                                text: text,
                                level: 0
                              } as NodeFieldsFragment
                            },
                            update: this.optimisticUpdateOnCapture
                          })
                          .then(() => {
                            refetch();
                          })
                          .catch(err => console.error(err));
                      }}
                    />
                  </div>
                </div>
              )}
          </div>

          {/* List */}
          <div
            className={`flex-column overflow-auto`}
            style={{
              height: `${this.props.windowHeight -
                this.state.listHeaderHeight}px`
            }}
          >
            {/* List Header Description */}
            <div className={`pv4 ph3 gray`}>{header}</div>

            {/* List */}
            <List
              // List
              listData={
                !isLoading && data !== null && data.list !== null
                  ? (data.list as ListFieldsFragment[])
                  : ([] as ListFieldsFragment[])
              }
              scrollToId={this.state.scrollToId}
              // Captures
              handleExpand={(id: string) => () => {
                this.props
                  .createSession({
                    variables: {
                      firstCaptureId: id,
                      title: null
                    }
                  })
                  .then(({ data: res }) => {
                    const sessionId = res.createSession.id;
                    return sessionId;
                  })
                  .then(sessionId => {
                    this.props.history.push(
                      `?id=${encodeURIComponent(sessionId)}`
                    );
                  })
                  .catch(err => console.error(err));
              }}
              handleIsShowingRelated={(
                id: string,
                callback?: () => void
              ) => () => {
                let captureState = this.state.captures.get(id);
                if (!captureState) {
                  captureState = this.createCaptureState();
                }
                let nextCaptureState = assign(captureState, {
                  isShowingRelated: !captureState.isShowingRelated
                });
                let nextCaptures = this.state.captures.set(
                  id,
                  nextCaptureState
                );
                this.setState(
                  {
                    captures: nextCaptures
                  },
                  callback
                );
              }}
              isShowingRelated={(id: string) => {
                let captureState = this.state.captures.get(id);
                if (!captureState) {
                  captureState = this.createCaptureState();
                }
                return captureState.isShowingRelated;
              }}
              handleFocus={(id: string) => () => {
                this.props.history.push(`?id=${encodeURIComponent(id)}`);
              }}
              handleEdit={(id: string) => text => {
                this.props
                  .editCapture({
                    variables: { id, body: text }
                  })
                  .then(() => {
                    refetch();
                  })
                  .catch(err => console.error(err));
              }}
              handleArchive={(id: string) => () => {
                let shouldRedirect =
                  NetworkUtils.getId(this.props.location.search) === id;
                this.props
                  .archiveCapture({
                    variables: { id },
                    optimisticResponse: {
                      archiveCapture: {
                        __typename: "Node",
                        id: `optimistic:${NetworkUtils.getRandomId()}`,
                        type: NodeType.Capture,
                        text: "",
                        level: 0
                      } as NodeFieldsFragment
                    },
                    update: (dataProxy, _) => {
                      const cacheData: SurfaceResultsFieldsFragment | null = dataProxy.readFragment(
                        {
                          id: "SurfaceResults",
                          fragment: surfaceResultsFragment,
                          fragmentName: "SurfaceResultsFields"
                        }
                      );
                      if (!(cacheData && cacheData.list && cacheData.graph)) {
                        return;
                      }
                      remove(cacheData.list, listItem => {
                        if (listItem) {
                          return listItem.id === id;
                        }
                        return false;
                      });
                      remove(cacheData.graph.nodes, node => node.id === id);
                      remove(
                        cacheData.graph.edges,
                        edge => edge.source === id || edge.destination === id
                      );
                      dataProxy.writeFragment({
                        id: "SurfaceResults",
                        fragment: surfaceResultsFragment,
                        fragmentName: "SurfaceResultsFields",
                        data: cacheData
                      });
                    }
                  })
                  .then(() => {
                    if (shouldRedirect) {
                      this.props.history.replace("/");
                    } else {
                      refetch();
                    }
                  })
                  .catch(err => console.error(err));
              }}
              handleDismissCaptureRelation={(fromId, toId) => {
                this.props
                  .dismissCaptureRelation({
                    variables: {
                      fromId,
                      toId
                    },
                    optimisticResponse: {
                      dismissCaptureRelation: {
                        __typename: "Node",
                        id: `optimistic:${NetworkUtils.getRandomId()}`,
                        type: NodeType.Capture,
                        text: "",
                        level: 0
                      } as NodeFieldsFragment
                    },
                    update: dataProxy => {
                      const cacheData: SurfaceResultsFieldsFragment | null = dataProxy.readFragment(
                        {
                          id: "SurfaceResults",
                          fragment: surfaceResultsFragment,
                          fragmentName: "SurfaceResultsFields"
                        }
                      );
                      if (!(cacheData && cacheData.list && cacheData.graph)) {
                        return;
                      }

                      cacheData.list.forEach((listItem, index) => {
                        if (listItem && listItem.id === fromId) {
                          if (listItem.relatedItems) {
                            remove(listItem.relatedItems, relatedItem => {
                              if (relatedItem) {
                                return relatedItem.id === toId;
                              }
                              return false;
                            });
                          }
                        }
                      });

                      remove(cacheData.graph.nodes, node => node.id === toId);
                      remove(
                        cacheData.graph.edges,
                        edge =>
                          edge.source === toId || edge.destination === toId
                      );
                      dataProxy.writeFragment({
                        id: "SurfaceResults",
                        fragment: surfaceResultsFragment,
                        fragmentName: "SurfaceResultsFields",
                        data: cacheData
                      });
                    }
                  })
                  .then(() => {
                    refetch();
                  })
                  .catch(err => console.error(err));
              }}
            />

            {/* Fetch More data in list */}
            {!isLoading && fetchMore ? (
              <div
                className={`pv4 tc f6 ttu gray pointer`}
                onClick={() => {
                  this.numberOfCallsToFetchMore =
                    this.numberOfCallsToFetchMore + 1;
                  fetchMore({
                    variables: {
                      count:
                        (this.numberOfCallsToFetchMore + 1) *
                        DEFAULT_LIST_LENGTH
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      // TODO: Only fetch what is needed and append to the list
                      // TODO: Only fetch when total is not exceeded
                      return fetchMoreResult;
                    }
                  });
                }}
              >
                Load more
              </div>
            ) : (
              <div className={`pv4`} />
            )}
          </div>
        </div>

        {/* Graph */}
        {isLargeWindow ? (
          <div className={`relative flex-grow`}>
            <div className={`absolute top-0 right-0 ma4 z-max`}>
              <MenuBar />
            </div>
            <div className={`absolute top-0 left-0 ma4 z-max`}>
              <Navigation
                handleHome={() => {
                  this.props.history.push(`/`);
                }}
                handleSession={() => {
                  this.props
                    .createSession({
                      variables: {
                        firstCaptureId: null,
                        title: null
                      }
                    })
                    .then(({ data: res }) => {
                      this.props.history.push(
                        `?id=${encodeURIComponent(res.createSession.id)}`
                      );
                    })
                    .catch(err => console.error(err));
                }}
                handleSurprise={() => {
                  this.props.history.push("?random=true");
                  if (
                    NetworkUtils.getCurrentLocation(
                      this.props.location.search
                    ) === Location.Random
                  ) {
                    refetch();
                  }
                }}
              />
            </div>
            <GraphVisualization
              refEChart={noop}
              nodes={data && data.graph.nodes ? data.graph.nodes : []}
              edges={data && data.graph.edges ? data.graph.edges : []}
              onClick={e => {
                // to prevent selecting and edge for now
                if (!e.data.id) {
                  return;
                }
                this.props.history.push(`?id=${encodeURIComponent(e.data.id)}`);
              }}
              onMouseOver={e => {
                this.setState({
                  scrollToId: e.data.id
                });
              }}
              onMouseOut={e => {
                this.setState({
                  scrollToId: undefined
                });
              }}
              showTooltip={false}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

// GraphQL Queries and Mutations
const withMostRecent = graphql<getMostRecentResponse, Props>(mostRecent, {
  name: "mostRecent",
  alias: "withMostRecent",
  skip: (props: Props) =>
    NetworkUtils.getCurrentLocation(props.location.search) !==
    Location.MostRecent,
  options: {
    variables: {
      start: 0,
      count: DEFAULT_LIST_LENGTH
    },
    fetchPolicy: "network-only"
  }
});

const withRandomCapture = graphql<randomCaptureResponse, Props>(randomCapture, {
  name: "randomCapture",
  alias: "withRandomCapture",
  skip: (props: Props) =>
    NetworkUtils.getCurrentLocation(props.location.search) !== Location.Random,
  options: {
    fetchPolicy: "network-only"
  }
});

const withSearch = graphql<searchResponse, Props>(search, {
  name: "search",
  alias: "withSearch",
  skip: (props: Props) =>
    NetworkUtils.getCurrentLocation(props.location.search) !== Location.Search,
  options: (props: Props) => ({
    variables: {
      rawQuery: NetworkUtils.getQuery(props.location.search),
      start: 0,
      count: DEFAULT_LIST_LENGTH
    },
    fetchPolicy: "network-only"
  })
});

const withGetDetailed = graphql<getDetailedResponse, Props>(getDetailed, {
  name: "getDetailed",
  alias: "withGetDetailed",
  skip: (props: Props) =>
    NetworkUtils.getCurrentLocation(props.location.search) !== Location.Detail,
  options: (props: Props) => ({
    variables: {
      id: NetworkUtils.getId(props.location.search)
    },
    fetchPolicy: "network-only"
  })
});

const withCreateSession = graphql<createSessionResponse, Props>(createSession, {
  name: "createSession",
  alias: "withCreateSession"
});

const withEditSession = graphql<editSessionResponse, Props>(editSession, {
  name: "editSession",
  alias: "withEditSession"
});

const withCreateSessionCapture = graphql<createSessionCaptureResponse, Props>(
  createSessionCapture,
  {
    name: "createSessionCapture",
    alias: "withCreateSessionCapture"
  }
);

const withCreateCapture = graphql<createCaptureResponse, Props>(createCapture, {
  name: "createCapture",
  alias: "withCreateCapture"
});

const withArchiveCapture = graphql<archiveCaptureResponse, Props>(
  archiveCapture,
  {
    name: "archiveCapture",
    alias: "withArchiveCapture"
  }
);

const withEditCapture = graphql<editCaptureResponse, Props>(editCapture, {
  name: "editCapture",
  alias: "withEditCapture"
});

const withDismissCaptureRelation = graphql<
  dismissCaptureRelationResponse,
  Props
>(dismissCaptureRelation, {
  name: "dismissCaptureRelation",
  alias: "withDismissCaptureRelation"
});

const MainWithData = compose(
  withMostRecent,
  withRandomCapture,
  withSearch,
  withGetDetailed,
  withCreateSession,
  withEditSession,
  withCreateSessionCapture,
  withCreateCapture,
  withEditCapture,
  withArchiveCapture,
  withDismissCaptureRelation
)(Main);

//  Window
const MainWithDataWithWindowSize = windowSize(MainWithData);

// Export
export default MainWithDataWithWindowSize;
