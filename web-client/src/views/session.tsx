// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  deleteSessionMutation as deleteSessionResponse,
  deleteSessionMutationVariables,
  getSessionQuery as getSessionResponse,
  getSessionQueryVariables
} from "../__generated__/types";

import { getSession, deleteSession } from "../queries";
import { graphql, compose, QueryProps, MutationFunc } from "react-apollo";

// Components
import HeaderSession from "../components/headers/header-session";
import ReactResizeDetector from "react-resize-detector";

// Utils
import windowSize from "react-window-size";
import InputSession from "../components/inputs/input-session";
import Markdown from "../components/help/markdown";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<getSessionQueryVariables> & Partial<getSessionResponse>;
  deleteSession: MutationFunc<
    deleteSessionResponse,
    deleteSessionMutationVariables
  >;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {
  headerHeight: number;
  footerHeight: number;
}

class Session extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      headerHeight: 0,
      footerHeight: 0
    };
  }

  shouldComponentUpdate(props: Props, state: State) {
    return true;
  }

  componentWillReceiveProps(nextProps: Props) {
    const sessionId = decodeURIComponent(this.props.match.params["id"]);
    const nextSessionId = decodeURIComponent(nextProps.match.params["id"]);
    if (sessionId !== nextSessionId) {
      this.handleDeleteSession();
    }
  }

  componentWillUnmount() {
    this.handleDeleteSession();
  }

  handleDeleteSession = () => {
    // const sessionCaptures = this.props.data.getSession;
    // if (
    //   !(
    //     sessionCaptures &&
    //     sessionCaptures.itemCollection &&
    //     sessionCaptures.itemCollection.items
    //   ) || // Do not delete if session has a title or captures
    //   (sessionCaptures.title || sessionCaptures.itemCollection.items.length > 0)
    // ) {
    //   return;
    // }
    // this.props
    //   .deleteSession({
    //     variables: {
    //       sessionId: sessionCaptures.id
    //     },
    //     update: ApolloUtils.deleteSessionUpdate(sessionCaptures.id)
    //   })
    //   .catch(err => {
    //     ErrorsUtils.errorHandler.report(err.message, err.stack);
    //   });
  };

  render() {
    const { data, windowHeight } = this.props;
    const { headerHeight, footerHeight } = this.state;

    if (!(data.getSession && !data.loading)) {
      return <div />;
    }

    const { title, id, body } = data.getSession;

    return (
      <div className={``}>
        {/* Header */}
        <div>
          <ReactResizeDetector
            handleHeight={true}
            onResize={(_, height) => {
              this.setState({
                headerHeight: height
              });
            }}
          />
          <HeaderSession />
        </div>
        <div
          className={`flex-column pa3`}
          style={{
            width: "35em",
            height: `${windowHeight - headerHeight - footerHeight}px`
          }}
        >
          <InputSession
            sessionId={id}
            startingHtml={body}
            startingTitle={title}
          />
        </div>
        {/* Footer */}
        <div className={``}>
          <ReactResizeDetector
            handleHeight={true}
            onResize={(_, height) => {
              this.setState({
                footerHeight: height
              });
            }}
          />
          <Markdown />
        </div>
      </div>
    );
  }
}

const withGetSession = graphql<getSessionResponse, Props>(getSession, {
  name: "data",
  alias: "withGetSession",
  options: (props: Props) => ({
    variables: {
      sessionId: decodeURIComponent(props.match.params["id"]),
      count: 20
    },
    fetchPolicy: "network-only"
  })
});

const withDeleteSession = graphql<deleteSessionResponse, Props>(deleteSession, {
  name: "deleteSession",
  alias: "withDeleteSession"
});

const ListCapturesWithData = windowSize(
  compose(
    withGetSession,
    withDeleteSession
  )(Session)
);

export default ListCapturesWithData;
