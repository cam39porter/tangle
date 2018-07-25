// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  createSessionMutation as createSessionResponse,
  createSessionCaptureMutationVariables
} from "../../__generated__/types";
import { createSession } from "../../queries";
import { graphql, MutationFunc } from "react-apollo";

// Components
import ButtonHome from "./../buttons/button-home";
import ButtonImport from "./../buttons/button-import";
import ButtonCapture from "./../buttons/button-capture";
import ButtonSettings from "../buttons/button-settings";
import { toast } from "react-toastify";

// Utils
import { FirebaseUtils, AnalyticsUtils, ErrorsUtils } from "../../utils";

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  createSession: MutationFunc<
    createSessionResponse,
    createSessionCaptureMutationVariables
  >;
}

interface State {}

class Navigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div
        className={`flex-column pa2 bg-dark-gray light-gray`}
        style={{
          userSelect: "none"
        }}
      >
        <div className={`flex-column flex-grow`}>
          <div
            className={`pa3 bg-animate hover-bg-light-silver bg-accent br-100 pointer`}
            onClick={() => {
              this.props
                .createSession({})
                .then(res => {
                  let id = res.data.createSession.id;
                  this.props.history.push(
                    `/note/${encodeURIComponent(id)}/format/list/related`
                  );
                  return id;
                })
                .then(id => {
                  AnalyticsUtils.trackEvent({
                    category: this.props.location.pathname.includes("note")
                      ? AnalyticsUtils.Categories.Session
                      : AnalyticsUtils.Categories.Home,
                    action: AnalyticsUtils.Actions.OpenQuickCreate,
                    label: id
                  });
                })
                .catch(err => {
                  ErrorsUtils.errorToasts.createSession();
                  ErrorsUtils.errorHandler.report(err.message, err.stack);
                });
            }}
          >
            <ButtonCapture />
          </div>
          <div
            className={`flex-column center justify-around pa3 mt2 bg-animate hover-bg-light-silver br-100 pointer`}
            onClick={() => {
              this.props.history.push(`/`);
              // TODO: add tracking to this
            }}
          >
            <ButtonHome />
          </div>
          <div
            className={`flex-column center justify-around pa3 mt2 bg-animate hover-bg-light-silver br-100 pointer`}
            onClick={() => {
              this.props.history.push(`/import`);
              // TODO: add tracking to this
            }}
          >
            <ButtonImport />
          </div>
        </div>
        <div
          className={`flex-column center justify-around pa3 br-100 bg-animate hover-bg-light-silver pointer`}
          onClick={() => {
            this.props.history.push(`/settings`);
            // TODO: add tracking to this
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

export default withCreateSession(Navigation);
