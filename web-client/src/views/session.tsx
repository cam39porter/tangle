// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getSession as getSessionResponse,
  getSessionVariables
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
import { ErrorsUtils } from "../utils/index";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<getSessionVariables> & Partial<getSessionResponse>;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {
  headerHeight: number;
  footerHeight: number;
  isSaving: boolean;
}

class Session extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      headerHeight: 0,
      footerHeight: 0,
      isSaving: false
    };
  }

  render() {
    const { data, windowHeight } = this.props;
    const { headerHeight, footerHeight, isSaving } = this.state;
    // @ts-ignore
    if (data.error) {
      ErrorsUtils.errorToasts.openSession();
    }

    if (!data.getSession) {
      return <div />;
    }

    const { title, id, body, created } = data.getSession;

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
          <HeaderSession created={created} isSaving={isSaving} />
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
            handleIsSaving={(isSavingNow: boolean) => {
              this.setState({
                isSaving: isSavingNow
              });
            }}
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
// @ts-ignore
const withGetSession = graphql<getSessionResponse, Props>(getSession, {
  // @ts-ignore
  name: "data",
  // @ts-ignore
  alias: "withGetSession",
  // @ts-ignore
  options: (props: Props) => ({
    variables: {
      sessionId: decodeURIComponent(props.match.params["id"]),
      count: 0
    },
    fetchPolicy: "network-only"
  })
});

export default windowSize(compose(withGetSession)(Session));
