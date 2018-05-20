// React
import * as React from "react";

// GraphQL
import {
  // Captured Today
  capturedTodayQuery as capturedTodayResponse,
  capturedTodayQueryVariables,
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
  // Comment on Capture
  createCommentCaptureMutation as createCommentCaptureResponse,
  createCommentCaptureMutationVariables,
  // Extra
  SearchResultsFieldsFragment,
  ListFieldsFragment,
  NodeType,
  GraphFieldsFragment,
  NodeFieldsFragment
} from "../__generated__/types";
import {
  // Queries
  capturedToday,
  search,
  getDetailed,
  // Mutations
  createSession,
  createSessionCapture,
  editSession,
  createCapture,
  archiveCapture,
  editCapture,
  createCommentCapture,
  // Fragments
  searchResultsFragment
} from "../queries";
import { graphql, compose, QueryProps, MutationFunc } from "react-apollo";

// Router
import { RouteComponentProps } from "react-router";

// Components
import List, { SESSION_CAPTURE_INPUT_ID } from "../components/list";
import GraphVisualization from "../components/graph-visualization";
import MenuBar from "../components/menu-bar";

// Utils
import { WindowUtils, NetworkUtils } from "../utils";
import { noop, trim, assign, reverse } from "lodash";
import windowSize from "react-window-size";

// Types
import { Location } from "../types";

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  // Queries
  capturedToday?: QueryProps<capturedTodayQueryVariables> &
    Partial<capturedTodayResponse>;
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
  createCommentCapture: MutationFunc<
    createCommentCaptureResponse,
    createCommentCaptureMutationVariables
  >;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface CaptureState {
  isMore: boolean;
  isEditing: boolean;
  isShowingRelated: boolean;
}

interface State {
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
  sessionIsEditingTitle?: boolean;
  sessionIsEditingTags?: boolean;
}

// Class
class Main extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      isCapturing:
        NetworkUtils.getCurrentLocation(nextProps.location.search) ===
        Location.CapturedToday,
      captureText: "",
      surfaceText: NetworkUtils.getQuery(nextProps.location.search),
      captures: new Map<string, CaptureState>(),
      sessionId: NetworkUtils.getIsSessionId(nextProps.location.search)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      isCapturing:
        NetworkUtils.getCurrentLocation(nextProps.location.search) ===
        Location.CapturedToday,
      surfaceText: NetworkUtils.getQuery(nextProps.location.search),
      sessionId: NetworkUtils.getIsSessionId(nextProps.location.search)
    });
  }

  createCaptureState = (id: string): CaptureState => {
    let captureState = {
      isMore: false,
      isEditing: false,
      isShowingRelated: true,
      text: ""
    };

    return captureState;
  };

  render() {
    let isLoading;
    let data;
    let refetch;
    let header;

    if (this.props.capturedToday) {
      isLoading = this.props.capturedToday.loading;
      data = this.props.capturedToday.getAll;
      refetch = this.props.capturedToday.refetch;
      header = "Captured Today";
    }

    if (this.props.search) {
      isLoading = this.props.search.loading;
      data = this.props.search.search;
      refetch = this.props.search.refetch;
      header = `Search results for "${NetworkUtils.getQuery(
        this.props.location.search
      )}"`;
    }

    if (this.props.getDetailed) {
      isLoading = this.props.getDetailed.loading;
      data = this.props.getDetailed.getDetailed;
      refetch = this.props.getDetailed.refetch;
      // TODO: remove this hack
      let focusId = NetworkUtils.getId(this.props.location.search);
      let splitId = focusId.split(";");
      if (splitId.length >= 2) {
        let focus = splitId[1];
        focus =
          focus.charAt(focus.length - 1) === ")"
            ? focus.slice(0, focus.length - 1)
            : focus;
        header = `Focusing on "${focus}"`;
      } else {
        header = `Focusing on the below capture`;
      }
    }

    let isLargeWindow = WindowUtils.getIsLargeWindow(this.props.windowWidth);

    return (
      <div className={`flex w-100 vh-100`}>
        {/* Menu Bar */}
        {isLargeWindow && (
          <div className={`fixed top-0 right-0 ma4 z-max`}>
            <MenuBar />
          </div>
        )}

        {/* List */}
        <div
          className={`shadow-1 z-max`}
          style={{
            minWidth: isLargeWindow ? "32.5em" : "100%",
            maxWidth: isLargeWindow ? "32.5em" : "100%"
          }}
        >
          <List
            // List
            isHidden={false}
            handleIsHidden={noop}
            listData={isLoading ? [] : data.list}
            scrollToId={this.state.scrollToId}
            header={header}
            // Session
            sessionId={this.state.sessionId}
            sessionTitle={this.state.sessionTitle}
            sessionTags={undefined}
            sessionIsEditingTags={false}
            sessionIsEditingTitle={
              this.state.sessionIsEditingTitle ? true : false
            }
            sessionHandleEditTags={noop}
            sessionHandleEditTitle={title => {
              let nextTitle = trim(title);
              if (!this.state.sessionId) {
                return;
              }

              if (this.state.sessionIsEditingTitle && nextTitle) {
                this.props
                  .editSession({
                    variables: {
                      sessionId: this.state.sessionId,
                      title: nextTitle
                    }
                  })
                  .then(({ data: res }) => {
                    this.setState({
                      sessionTitle: res.editSession.text,
                      sessionIsEditingTitle: !this.state.sessionIsEditingTitle
                    });
                  })
                  .then(() => {
                    refetch();
                  })
                  .catch(err => console.error(err));
              } else {
                this.setState({
                  sessionIsEditingTitle: !this.state.sessionIsEditingTitle
                });
              }
            }}
            sessionHandleCapture={() => {
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
                  }
                })
                .then(() => {
                  refetch();
                  this.setState({
                    scrollToId: SESSION_CAPTURE_INPUT_ID
                  });
                })
                .catch(err => console.error(err));
            }}
            sessionHandleClose={() => {
              this.setState({
                sessionTitle: "",
                sessionIsEditingTags: false,
                sessionIsEditingTitle: false
              });
              this.props.history.goBack();
            }}
            // Header
            handleHeaderCaptureTextChange={nextCaptureText => {
              // this handles the session capture bar as well
              this.setState({
                captureText: nextCaptureText
              });
            }}
            handleHeaderCapture={() => {
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
                      __typename: "Graph",
                      nodes: [
                        {
                          __typename: "Node",
                          id: NetworkUtils.getRandomId(),
                          type: NodeType.Capture,
                          text: this.state.captureText,
                          level: 0
                        }
                      ],
                      edges: []
                    } as GraphFieldsFragment
                  },
                  update: (
                    dataProxy,
                    resultData: { data: { createCapture: GraphFieldsFragment } }
                  ) => {
                    const optimisticResponse = resultData.data.createCapture;
                    const cacheData: SearchResultsFieldsFragment | null = dataProxy.readFragment(
                      {
                        id: "SearchResults",
                        fragment: searchResultsFragment,
                        fragmentName: "SearchResultsFields"
                      }
                    );

                    if (!(cacheData && cacheData.list && cacheData.graph)) {
                      return;
                    }

                    let tempListItem: ListFieldsFragment = {
                      __typename: "ListItem",
                      id: optimisticResponse.nodes[0].id,
                      text: {
                        __typename: "AnnotatedText",
                        text: optimisticResponse.nodes[0].text,
                        annotations: []
                      },
                      reasons: [],
                      relatedItems: []
                    };

                    let tempList = reverse(cacheData.list);
                    tempList.push(tempListItem);

                    let tempNode: NodeFieldsFragment =
                      optimisticResponse.nodes[0];

                    cacheData.list = reverse(tempList);
                    cacheData.graph.nodes.push(tempNode);

                    dataProxy.writeFragment({
                      id: "SearchResults",
                      fragment: searchResultsFragment,
                      fragmentName: "SearchResultsFields",
                      data: cacheData
                    });
                  }
                })
                .then(() => {
                  refetch();
                })
                .catch(err => console.error(err));
            }}
            handleHeaderExpand={() => {
              this.props
                .createSession({})
                .then(({ data: res }) => {
                  this.props.history.push(
                    `?id=${encodeURIComponent(res.createSession.id)}`
                  );
                })
                .catch(err => console.error(err));
            }}
            isHeaderCapturing={this.state.isCapturing}
            handleHeaderIsCapturing={() => {
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
              this.props.history.push(`?query=${encodeURIComponent(query)}`);
            }}
            handleSurfaceClear={() => {
              this.props.history.push(`/`);
            }}
            surfaceStartingText={NetworkUtils.getQuery(
              this.props.location.search
            )}
            headerPaddingText={
              this.state.isCapturing
                ? this.state.captureText
                : this.state.surfaceText
            }
            footerPaddingText={""}
            // Captures
            handleExpand={(id: string) => () => {
              // this.props
              //   .createSession({})
              //   .then(({ data: res }) => {
              //     let id = res.createSession.id;
              //     // Add capture to beginning of session
              //     return id;
              //   })
              //   .then(id => {
              //     this.props.history.push(`?id=${encodeURIComponent(id)}`);
              //   })
              //   .catch(err => console.error(err));

              return noop;
            }}
            handleIsShowingRelated={(id: string) => () => {
              let captureState = this.state.captures.get(id);
              if (!captureState) {
                captureState = this.createCaptureState(id);
              }
              let nextCaptureState = assign(captureState, {
                isShowingRelated: !captureState.isShowingRelated
              });
              let nextCaptures = this.state.captures.set(id, nextCaptureState);
              this.setState({
                captures: nextCaptures
              });
            }}
            isShowingRelated={(id: string) => {
              let captureState = this.state.captures.get(id);
              if (!captureState) {
                captureState = this.createCaptureState(id);
              }
              return captureState.isShowingRelated;
            }}
            handleMore={(id: string) => () => {
              let captureState = this.state.captures.get(id);
              if (!captureState) {
                captureState = this.createCaptureState(id);
              }
              let nextCaptureState = assign(captureState, {
                isMore: !captureState.isMore
              });
              let nextCaptures = this.state.captures.set(id, nextCaptureState);
              this.setState({
                captures: nextCaptures
              });
            }}
            isMore={(id: string) => {
              let captureState = this.state.captures.get(id);
              if (!captureState) {
                captureState = this.createCaptureState(id);
              }
              return captureState.isMore;
            }}
            handleComment={(id: string) => (text: string) => {
              this.props
                .createCommentCapture({
                  variables: {
                    commentedOnCaptureId: id,
                    body: text
                  }
                })
                .then(() => {
                  refetch();
                })
                .catch(err => console.error(err));
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
              let nextCaptures = this.state.captures.set(id, nextCaptureState);

              if (!captureState.isEditing) {
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
              } else {
                this.setState({
                  captures: nextCaptures
                });
              }
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
                  variables: { id }
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
          />
        </div>

        {/* Graph */}
        {isLargeWindow ? (
          <div className={`flex-grow`}>
            <GraphVisualization
              refEChart={noop}
              nodes={isLoading ? [] : data.graph.nodes}
              edges={isLoading ? [] : data.graph.edges}
              onClick={e => {
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
const withCapturedToday = graphql<capturedTodayResponse, Props>(capturedToday, {
  name: "capturedToday",
  alias: "withCapturedToday",
  skip: (props: Props) =>
    NetworkUtils.getCurrentLocation(props.location.search) !==
    Location.CapturedToday,
  options: {
    variables: {
      timezoneOffset: new Date().getTimezoneOffset() / 60 * -1
    },
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
      rawQuery: NetworkUtils.getQuery(props.location.search)
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

const withCreateCommentCapture = graphql<createCommentCaptureResponse, Props>(
  createCommentCapture,
  {
    name: "createCommentCapture",
    alias: "withCreateCommentCapture"
  }
);

const MainWithData = compose(
  withCapturedToday,
  withSearch,
  withGetDetailed,
  withCreateSession,
  withEditSession,
  withCreateSessionCapture,
  withCreateCapture,
  withEditCapture,
  withArchiveCapture,
  withCreateCommentCapture
)(Main);

//  Window
const MainWithDataWithWindowSize = windowSize(MainWithData);

// Export
export default MainWithDataWithWindowSize;
