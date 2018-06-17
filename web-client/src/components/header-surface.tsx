// React
import * as React from "react";

// Router
import { RouteComponentProps, withRouter } from "react-router";

// Components
import InputSurface from "./input-surface";

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
      <div className={`bb bw1 b--light-gray`}>
        <div className={`flex pa2`}>
          <div className={`flex-grow flex`}>
            <div
              className={`ph2 flex-column justify-around items-center dark-gray`}
            >
              Description
            </div>
            <div
              className={`ph2 flex-column justify-around items-center dark-gray pointer`}
              onClick={this.props.handleIsGraphView}
            >
              {this.props.isGraphView ? "List" : "Graph"}
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
