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
import ListHeader from "../components/list-header";
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
  isEditing: boolean;
  isShowingRelated: boolean;
}

interface State {
  listHeaderHeight: number;
  listFooterHeight: number;
  // Header
  isCapturing: boolean;
  captureText: string;
  surfaceText: string;
  // Captures
  captures: Map<string, CaptureState>;
  scrollToId?: string;
  // Session
  sessionId?: string;
  sessionTitle?: string;
}

// Class
class Main extends React.Component<Props, State> {
  numberOfCallsToFetchMore = 0; // track the number of times more items are requested

  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      listHeaderHeight: 0,
      listFooterHeight: 0,
      isCapturing:
        NetworkUtils.getCurrentLocation(nextProps.location.search) ===
        Location.MostRecent,
      captureText: "",
      surfaceText: NetworkUtils.getQuery(nextProps.location.search),
      captures: new Map<string, CaptureState>(),
      sessionId: NetworkUtils.getIsSessionId(nextProps.location.search)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const sessionId = NetworkUtils.getIsSessionId(nextProps.location.search);

    this.setState({
      listHeaderHeight: sessionId ? 0 : this.state.listHeaderHeight,
      listFooterHeight: sessionId ? this.state.listFooterHeight : 0,
      isCapturing:
        NetworkUtils.getCurrentLocation(nextProps.location.search) ===
        Location.MostRecent,
      surfaceText: NetworkUtils.getQuery(nextProps.location.search),
      sessionId
    });
  }

  createCaptureState = (id: string): CaptureState => {
    let captureState = {
      isMore: false,
      isEditing: false,
      isShowingRelated: false,
      text: ""
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
    let tempListItem: ListFieldsFragment = {
      __typename: "ListItem",
      id: optimisticResponse.id,
      text: {
        __typename: "AnnotatedText",
        text: optimisticResponse.text,
        annotations: []
      },
      reasons: [],
      relatedItems: []
    };
    let tempList = reverse(cacheData.list);
    tempList.push(tempListItem);
    let tempNode: NodeFieldsFragment = optimisticResponse;
    // insert at the top of list of this is not a session
    if (!this.state.sessionId) {
      cacheData.list = reverse(tempList);
    }
    cacheData.graph.nodes.push(tempNode);
    dataProxy.writeFragment({
      id: "SurfaceResults",
      fragment: surfaceResultsFragment,
      fragmentName: "SurfaceResultsFields",
      data: cacheData
    });
  };

  render() {
    let isLoading;
    let data;
    let refetch;
    let fetchMore;
    let header;
    let pivot: NodeFieldsFragment | undefined;

    // Most Recent
    if (this.props.mostRecent) {
      isLoading = this.props.mostRecent.loading;
      data = this.props.mostRecent.getMostRecent;
      refetch = this.props.mostRecent.refetch;
      fetchMore = isLoading ? undefined : this.props.mostRecent.fetchMore;
      header = "Most recent captures";
    }

    // Search
    if (this.props.search) {
      isLoading = this.props.search.loading;
      data = this.props.search.search;
      refetch = this.props.search.refetch;
      fetchMore = isLoading ? undefined : this.props.search.fetchMore;
      header = `Search results for "${NetworkUtils.getQuery(
        this.props.location.search
      )}"`;
    }

    // Random
    if (this.props.randomCapture) {
      isLoading = this.props.randomCapture.loading;
      data = this.props.randomCapture.getAll;
      refetch = this.props.randomCapture.refetch;
      header = "Focusing on the random capture below";
    }

    // Detailed
    if (this.props.getDetailed) {
      isLoading = this.props.getDetailed.loading;
      data = this.props.getDetailed.getDetailed;
      refetch = this.props.getDetailed.refetch;
      pivot =
        (this.props.getDetailed.getDetailed &&
          this.props.getDetailed.getDetailed.pivot) ||
        undefined;
      header = pivot
        ? pivot.type === NodeType.Capture
          ? `Focusing on the capture below`
          : `Focusing on "${
              pivot.type === NodeType.Tag ? "#" + pivot.text : pivot.text
            }"`
        : undefined;
    }

    let isLargeWindow = WindowUtils.getIsLargeWindow(this.props.windowWidth);

    return (
      <div className={`flex w-100 vh-100`}>
        {/* List */}
        <div
          className={`shadow-3 bg-light-gray z-5`}
          style={{
            width: isLargeWindow ? "32.5em" : "100%"
          }}
        >
          {/* Capture Header */}
          {!this.state.sessionId && (
            <div
              className={`pa4 ${
                this.state.isCapturing ? "bg-accent" : "bg-base"
              }`}
            >
              <ReactResizeDetector
                handleHeight={true}
                onResize={(_, height) => {
                  this.setState({
                    listHeaderHeight: height + 64
                  });
                }}
              />
              <ListHeader
                handleCaptureTextChange={nextCaptureText => {
                  this.setState({
                    captureText: nextCaptureText
                  });
                }}
                handleCapture={() => {
                  if (!this.state.captureText) {
                    return;
                  }
                  this.props
                    .createCapture({
                      variables: {
                        body: this.state.captureText
                      },
                      optimisticResponse: {
                        createCapture: {
                          __typename: "Node",
                          id: `optimistic:${NetworkUtils.getRandomId()}`,
                          type: NodeType.Capture,
                          text: this.state.captureText,
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
                handleExpand={() => {
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
                isCapturing={this.state.isCapturing}
                handleIsCapturing={() => {
                  this.setState({
                    isCapturing: !this.state.isCapturing
                  });
                }}
                handleSurfaceTextChange={nextSurfaceText => {
                  this.setState({
                    surfaceText: nextSurfaceText
                  });
                }}
                handleSurface={() => {
                  let query = trim(this.state.surfaceText);
                  if (!query) {
                    return;
                  }
                  this.props.history.push(
                    `?query=${encodeURIComponent(query)}`
                  );
                }}
                handleClear={() => {
                  this.props.history.push(`/`);
                }}
                surfaceStartingText={NetworkUtils.getQuery(
                  this.props.location.search
                )}
              />
            </div>
          )}

          {/* List */}
          <div
            className={`flex-column overflow-auto`}
            style={{
              height: `${this.props.windowHeight -
                this.state.listHeaderHeight -
                this.state.listFooterHeight}px`
            }}
          >
            {/* Session Title / Tags */}
            {this.state.sessionId && (
              <div>
                <ListSessionHeader
                  startingTitle={
                    this.state.sessionTitle || (pivot && pivot.text)
                  }
                  handleEditTitle={title => {
                    if (!this.state.sessionId) {
                      return;
                    }

                    this.props
                      .editSession({
                        variables: {
                          sessionId: this.state.sessionId,
                          title
                        }
                      })
                      .then(({ data: res }) => {
                        this.setState({
                          sessionTitle:
                            res.editSession.text === "Untitled"
                              ? undefined
                              : res.editSession.text
                        });
                      })
                      .then(() => {
                        refetch();
                      })
                      .catch(err => console.error(err));
                  }}
                  startingTags={undefined}
                  handleEditTags={noop}
                  handleClose={() => {
                    this.setState({
                      sessionTitle: undefined
                    });
                    if (this.props.history.length > 2) {
                      this.props.history.goBack();
                    } else {
                      this.props.history.push("/");
                    }
                  }}
                />
              </div>
            )}

            {header &&
              !this.state.sessionId && (
                <div className={`pv4 ph3 gray`}>{header}</div>
              )}

            <List
              // List
              listData={isLoading ? [] : data.list}
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
                  captureState = this.createCaptureState(id);
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
                  captureState = this.createCaptureState(id);
                }
                return captureState.isShowingRelated;
              }}
              handleFocus={(id: string) => () => {
                this.props.history.push(`?id=${encodeURIComponent(id)}`);
              }}
              handleEdit={(id: string) => text => {
                let captureState = this.state.captures.get(id);
                if (!captureState) {
                  captureState = this.createCaptureState(id);
                }
                let nextCaptureState = assign(captureState, {
                  isEditing: !captureState.isEditing
                });
                let nextCaptures = this.state.captures.set(
                  id,
                  nextCaptureState
                );

                this.props
                  .editCapture({
                    variables: { id, body: text }
                  })
                  .then(() => {
                    refetch();
                  })
                  .then(() => {
                    this.setState({
                      captures: nextCaptures
                    });
                  })
                  .catch(err => console.error(err));
              }}
              isEditing={(id: string) => {
                let captureState = this.state.captures.get(id);
                if (!captureState) {
                  captureState = this.createCaptureState(id);
                }
                return captureState.isEditing;
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
                        text: this.state.captureText,
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
                      this.props.history.goBack();
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
                        text: this.state.captureText,
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
            {fetchMore ? (
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

          {/* Session Capture */}
          {this.state.sessionId && (
            <div className={`pa2 pv4 bg-white`}>
              <ReactResizeDetector
                handleHeight={true}
                onResize={(_, height) => {
                  this.setState({
                    listFooterHeight: height + 64
                  });
                }}
              />
              <InputCapture
                handleCapture={() => {
                  if (!this.state.captureText || !this.state.sessionId) {
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
                        body: this.state.captureText,
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
                          text: this.state.captureText,
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
                handleOnChange={nextCaptureText => {
                  this.setState({
                    captureText: nextCaptureText
                  });
                }}
              />
            </div>
          )}
        </div>

        {/* Graph */}
        {isLargeWindow ? (
          <div className={`relative flex-grow`}>
            <div className={`absolute top-0 right-0 ma4 z-max`}>
              <MenuBar />
            </div>
            <div className={`absolute top-0 left-0 ma4 z-max`}>
              <Navigation
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
              nodes={isLoading ? [] : data.graph.nodes}
              edges={isLoading ? [] : data.graph.edges}
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
