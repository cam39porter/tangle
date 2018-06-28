// React
import * as React from "react";

// Router
import { RouteComponentProps, withRouter } from "react-router";

// Components
import InputSurface from "../inputs/input-surface";
import ButtonMore from "./../buttons/button-more";

// Utils
const HeaderItem = (props: { name: string; onClick?: () => void }) => (
  <div className={`pv2 tl pointer`} onClick={props.onClick}>
    {props.name}
  </div>
);

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  isGraphView: boolean;
  handleIsGraphView: () => void;
}

interface State {
  isShowingMore: boolean;
}

class HeaderSurface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isShowingMore: false
    };
  }

  render() {
    const url = this.props.match.url;
    const params = this.props.location.search;

    return (
      <div
        className={`bb bw1 b--light-gray`}
        style={{
          minHeight: "4em",
          userSelect: "none"
        }}
      >
        <div className={`flex justify-between pa2`}>
          <div className={`ph2 flex`}>
            <div className={`flex-column items w4 dark-gray`}>
              <div
                className={`mb2 bb b--accent`}
                onClick={() => {
                  this.setState({
                    isShowingMore: !this.state.isShowingMore
                  });
                }}
              >
                {this.props.location.pathname.includes("/recent") && (
                  <HeaderItem name="Recent" />
                )}
                {this.props.location.pathname.includes("/related") && (
                  <HeaderItem name="Related Captures" />
                )}
                {this.props.location.pathname.includes("/search") && (
                  <HeaderItem name="Search Results" />
                )}
              </div>
              {this.state.isShowingMore && (
                <div>
                  {!this.props.location.pathname.includes("/recent") && (
                    <HeaderItem
                      name="Recent"
                      onClick={() => {
                        if (url === "/") {
                          this.props.history.push(`${url}recent${params}`);
                        } else {
                          this.props.history.push(`${url}/recent${params}`);
                        }
                        this.setState({
                          isShowingMore: false
                        });
                      }}
                    />
                  )}
                  {this.props.match.path !== "/" &&
                    !this.props.location.pathname.includes("/related") && (
                      <HeaderItem
                        name="Related Captures"
                        onClick={() => {
                          if (url === "/") {
                            this.props.history.push(`${url}related${params}`);
                          } else {
                            this.props.history.push(`${url}/related${params}`);
                          }
                          this.setState({
                            isShowingMore: false
                          });
                        }}
                      />
                    )}
                  {!this.props.location.pathname.includes("/search") && (
                    <HeaderItem
                      name="Search Results"
                      onClick={() => {
                        if (url === "/") {
                          this.props.history.push(`${url}search${params}`);
                        } else {
                          this.props.history.push(`${url}/search${params}`);
                        }
                        this.setState({
                          isShowingMore: false
                        });
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            <div className={`flex items-start ph2`}>
              <ButtonMore
                isMore={this.state.isShowingMore}
                onClick={() => {
                  this.setState({ isShowingMore: !this.state.isShowingMore });
                }}
              />
            </div>
            <div className={`flex items-start`}>
              <div
                className={`pa2 pointer br4 ${
                  this.props.isGraphView ? "bg-accent light-gray" : ""
                }`}
                onClick={this.props.handleIsGraphView}
              >
                Visualize
              </div>
            </div>
          </div>
          <div
            className={`flex-grow`}
            style={{
              maxWidth: "20em"
            }}
          >
            <InputSurface />
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(HeaderSurface);
