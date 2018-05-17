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
  ListFieldsFragment
} from "../__generated__/types";
import {
  capturedToday,
  search,
  getDetailed,
  createSession,
  createSessionCapture,
  editSession,
  createCapture,
  archiveCapture,
  editCapture,
  createCommentCapture
} from "../queries";
import { graphql, compose, QueryProps, MutationFunc } from "react-apollo";

// Router
import { RouteComponentProps } from "react-router";

// Components
import List, { SESSION_CAPTURE_INPUT_ID } from "../components/list";
import GraphVisualization from "../components/graph-visualization";
import MenuBar from "../components/menu-bar";

// Utils
import {
  getIsLargeWindow,
  getCurrentLocation,
  getQuery,
  getId,
  getIsSessionId
} from "../utils";
import { noop, trim, assign } from "lodash";
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
        getCurrentLocation(nextProps.location.search) ===
        Location.CapturedToday,
      captureText: "",
      surfaceText: getQuery(nextProps.location.search),
      captures: new Map<string, CaptureState>(),
      sessionId: getIsSessionId(nextProps.location.search)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      isCapturing:
        getCurrentLocation(nextProps.location.search) ===
        Location.CapturedToday,
      surfaceText: getQuery(nextProps.location.search),
      sessionId: getIsSessionId(nextProps.location.search)
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

    if (this.props.capturedToday) {
      isLoading = this.props.capturedToday.loading;
      data = this.props.capturedToday.getAll;
      refetch = this.props.capturedToday.refetch;
    }

    if (this.props.search) {
      isLoading = this.props.search.loading;
      data = this.props.search.search;
      refetch = this.props.search.refetch;
    }

    if (this.props.getDetailed) {
      isLoading = this.props.getDetailed.loading;
      data = this.props.getDetailed.getDetailed;
      refetch = this.props.getDetailed.refetch;
    }

    let isLargeWindow = getIsLargeWindow(this.props.windowWidth);

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
          className={`shadow-1`}
          style={{
            minWidth: isLargeWindow ? "35em" : "100%",
            maxWidth: isLargeWindow ? "35em" : "100%"
          }}
        >
          <List
            // List
            isHidden={false}
            handleIsHidden={noop}
            listData={isLoading ? [] : data.list}
            scrollToId={this.state.scrollToId}
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
            surfaceStartingText={getQuery(this.props.location.search)}
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
              this.props
                .archiveCapture({
                  variables: { id }
                })
                .then(() => {
                  refetch();
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
    getCurrentLocation(props.location.search) !== Location.CapturedToday,
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
    getCurrentLocation(props.location.search) !== Location.Search,
  options: (props: Props) => ({
    variables: {
      rawQuery: getQuery(props.location.search)
    },
    fetchPolicy: "network-only"
  })
});

const withGetDetailed = graphql<getDetailedResponse, Props>(getDetailed, {
  name: "getDetailed",
  alias: "withGetDetailed",
  skip: (props: Props) =>
    getCurrentLocation(props.location.search) !== Location.Detail,
  options: (props: Props) => ({
    variables: {
      id: getId(props.location.search)
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
