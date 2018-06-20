// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// GraphQL
import {
  deleteSessionMutation as deleteSessionResponse,
  deleteSessionMutationVariables,
  SessionCollectionFieldsFragment,
  SurfaceResultsFieldsFragment
} from "../__generated__/types";
import {
  deleteSession,
  sessionCollectionFragment,
  surfaceResultsFragment
} from "../queries";
import { graphql, compose, MutationFunc } from "react-apollo";

// Components
import ButtonArchive from "./button-archive";

// Utils
import { remove } from "lodash";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  id: string;
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
          className={`flex justify-between pa3 w-100 bb bw1 b--light-gray pointer`}
          onClick={() => {
            this.props.history.push(
              `/session/${encodeURIComponent(this.props.id)}/related`
            );
          }}
        >
          <div className={`flex-grow flex-column justify-around`}>
            <div className={`f5 dark-gray`}>
              {this.props.title || "Untitled "}
            </div>
          </div>
          <div className={`relative flex-column justify-around`}>
            <div className={`tr f6 gray`}>
              {new Date(this.props.created).toDateString()}
            </div>
            {this.state.isShowingButtons && (
              <div
                className={`absolute flex-column justify-around right--2 z-max bg-near-white gray`}
              >
                <div
                  className={``}
                  onClick={e => {
                    e.stopPropagation();

                    this.props
                      .deleteSession({
                        variables: {
                          sessionId: this.props.id
                        },
                        optimisticResponse: {
                          deleteSession: true
                        },
                        update: store => {
                          // SessionCollection
                          let sessionCollection: SessionCollectionFieldsFragment | null = store.readFragment(
                            {
                              id: "SessionCollection",
                              fragment: sessionCollectionFragment,
                              fragmentName: "SessionCollectionFields"
                            }
                          );
                          if (sessionCollection && sessionCollection.items) {
                            store.writeFragment({
                              id: "SessionCollection",
                              fragment: sessionCollectionFragment,
                              fragmentName: "SessionCollectionFields",
                              data: {
                                __typename: "SessionCollection",
                                items: sessionCollection.items.filter(
                                  capture => capture.id !== this.props.id
                                ),
                                pagingInfo: sessionCollection.pagingInfo
                              }
                            });
                          }

                          // SurfaceResults
                          const surfaceResults: SurfaceResultsFieldsFragment | null = store.readFragment(
                            {
                              id: "SurfaceResults",
                              fragment: surfaceResultsFragment,
                              fragmentName: "SurfaceResultsFields"
                            }
                          );
                          if (surfaceResults && surfaceResults.graph) {
                            remove(
                              surfaceResults.graph.nodes,
                              node => node.id === this.props.id
                            );
                            remove(
                              surfaceResults.graph.edges,
                              edge =>
                                edge.source === this.props.id ||
                                edge.destination === this.props.id
                            );
                            store.writeFragment({
                              id: "SurfaceResults",
                              fragment: surfaceResultsFragment,
                              fragmentName: "SurfaceResultsFields",
                              data: {
                                __typename: "SurfaceResults",
                                ...surfaceResults
                              }
                            });
                          }
                        }
                      })
                      .catch(err => {
                        console.error(err);
                      });
                  }}
                >
                  <ButtonArchive />
                </div>
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
