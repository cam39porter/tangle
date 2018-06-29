// React
import * as React from "react";

// Router
import { RouteComponentProps, withRouter } from "react-router";

// Components
import InputSurface from "../inputs/input-surface";
import Header from "./header";
// Utils

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  isGraphView: boolean;
  handleIsGraphView: () => void;
}

interface State {}

class HeaderSurface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Header
        left={
          <div className={`flex`}>
            <div className={`flex-column justify-around`}>
              <div
                className={`pa2 pointer bb b--accent ${
                  this.props.isGraphView ? "br4 bg-accent light-gray" : ""
                }`}
                onClick={this.props.handleIsGraphView}
              >
                Visualize
              </div>
            </div>
            <div className={`pa2 flex-column justify-around gray`}>
              {this.props.location.pathname.includes("/recent") &&
                "your recent content"}
              {this.props.location.pathname.includes("/related") &&
                "your related content"}
              {this.props.location.pathname.includes("/search") &&
                "your search results"}
            </div>
          </div>
          /* tslint:disable-next-line */
        }
        right={
          <div
            className={`pl2 flex-column justify-around`}
            style={{
              minWidth: "20em"
            }}
          >
            <InputSurface />
          </div>
          /* tslint:disable-next-line */
        }
      />
    );
  }
}
export default withRouter(HeaderSurface);
