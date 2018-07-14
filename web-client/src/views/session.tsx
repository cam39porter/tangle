// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getSessionQuery as getSessionResponse,
  getSessionQueryVariables
} from "../__generated__/types";

import { getSession } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import HeaderSession from "../components/headers/header-session";
import ReactResizeDetector from "react-resize-detector";

// Utils
import windowSize from "react-window-size";
import InputSession from "../components/inputs/input-session";
import Markdown from "../components/help/markdown";
import { isEqual } from "lodash";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<getSessionQueryVariables> & Partial<getSessionResponse>;
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

  render() {
    const { data, windowHeight } = this.props;
    const { headerHeight, footerHeight } = this.state;

    if (!data.getSession) {
      return <div />;
    }

    const { title, id, body, created, lastModified } = data.getSession;

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
          <HeaderSession created={created} lastModified={lastModified} />
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

export default windowSize(compose(withGetSession)(Session));
