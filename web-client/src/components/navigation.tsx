// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  createSessionMutation as createSessionResponse,
  createSessionCaptureMutationVariables
} from "../__generated__/types";
import { createSession } from "../queries";
import { graphql, compose, MutationFunc } from "react-apollo";

// Components
import ButtonCapture from "./button-capture";
import ButtonExit from "./button-exit";
import ButtonZap from "./button-zap";
import ButtonSettings from "./button-settings";

// Utils
import { NetworkUtils } from "../utils";

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  createSession: MutationFunc<
    createSessionResponse,
    createSessionCaptureMutationVariables
  >;
}

interface State {
  isShowingSettings: boolean;
  isShowingImport: boolean;
}

class Navigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isShowingSettings: false,
      isShowingImport: false
    };
  }

  render() {
    const isCapturing = NetworkUtils.getCapture(this.props.location.search)
      ? true
      : false;
    const query = NetworkUtils.getQuery(this.props.location.search);

    return (
      <div
        className={`flex-column pa2 pt4 bg-dark-gray light-gray`}
        style={{
          userSelect: "none"
        }}
      >
        <div className={`flex-column flex-grow`}>
          <div
            className={`pa2 dim bg-accent br-100 pointer`}
            onClick={() => {
              if (isCapturing) {
                this.props.history.push(
                  `${this.props.location.pathname}?${
                    query ? `query=${query}` : ``
                  }`
                );
                return;
              }
              this.props.history.push(
                `${this.props.location.pathname}?${
                  query ? `query=${query}&` : ``
                }capture=true`
              );
            }}
          >
            {isCapturing ? <ButtonExit /> : <ButtonCapture />}
          </div>
          <div
            className={`pa2 dim pointer`}
            onClick={() => {
              this.props
                .createSession({})
                .then(res => {
                  this.props.history.push(
                    `/session/${encodeURIComponent(
                      res.data.createSession.id
                    )}/recent`
                  );
                })
                .catch(err => {
                  console.error(err);
                });
            }}
          >
            <ButtonZap />
          </div>
        </div>
        <div
          className={`pa2 dim pointer`}
          onClick={() => {
            this.setState({
              isShowingImport: false,
              isShowingSettings: !this.state.isShowingSettings
            });
          }}
        >
          <ButtonSettings />
        </div>
      </div>
    );
  }
}

const withCreateSession = graphql<createSessionResponse, Props>(createSession, {
  name: "createSession",
  alias: "withCreateSession"
});

export default compose(withCreateSession)(Navigation);
