// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// GraphQL
import {
  deleteSessionMutation as deleteSessionResponse,
  deleteSessionMutationVariables
} from "../../__generated__/types";
import { deleteSession } from "../../queries";
import { graphql, compose, MutationFunc } from "react-apollo";

// Components
import ButtonArchive from "./../buttons/button-archive";

// Utils
import { ApolloUtils, AnalyticsUtils } from "../../utils";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  sessionId: string;
  title: string;
  created: string;
  deleteSession: MutationFunc<
    deleteSessionResponse,
    deleteSessionMutationVariables
  >;
}

interface State {
  isShowingButtons: boolean;
}

class CardSession extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      isShowingButtons: false
    };
  }

  render() {
    return (
      <div
        key={this.props.sessionId}
        onMouseEnter={() => {
          this.setState({
            isShowingButtons: true
          });
        }}
        onMouseLeave={() => {
          this.setState({
            isShowingButtons: false
          });
        }}
      >
        <div
          id={`list-session`}
          className={`flex justify-between pa3 w-100 bb bw1 b--light-gray bg-animate hover-bg-white pointer`}
          onClick={() => {
            this.props.history.push(
              `/collection/${encodeURIComponent(
                this.props.sessionId
              )}/format/list/related/`
            );
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.OpenSession,
              label: this.props.sessionId
            });
          }}
        >
          <div className={`flex-grow flex-column justify-around`}>
            <div className={`f5 dark-gray`}>
              {this.props.title || "Untitled "}
            </div>
          </div>
          <div className={`relative flex-column justify-around`}>
            {this.state.isShowingButtons ? (
              <div
                className={``}
                onClick={e => {
                  e.stopPropagation();

                  this.props
                    .deleteSession({
                      variables: {
                        sessionId: this.props.sessionId
                      },
                      optimisticResponse: {
                        deleteSession: true
                      },
                      update: ApolloUtils.deleteSessionUpdate(
                        this.props.sessionId
                      )
                    })
                    .then(() => {
                      AnalyticsUtils.trackEvent({
                        category: this.props.match.params["id"]
                          ? AnalyticsUtils.Categories.Session
                          : AnalyticsUtils.Categories.Home,
                        action: AnalyticsUtils.Actions.DeleteSession,
                        label: this.props.sessionId
                      });
                    })
                    .catch(err => {
                      console.error(err);
                    });
                }}
              >
                <ButtonArchive />
              </div>
            ) : (
              <div className={`tr f6 gray`}>
                {new Date(this.props.created).toDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const withDeleteSession = graphql<deleteSessionResponse, Props>(deleteSession, {
  name: "deleteSession",
  alias: "withDeleteSession"
});

const CardSessionWithData = compose(
  withDeleteSession,
  withRouter
)(CardSession);

export default CardSessionWithData;
