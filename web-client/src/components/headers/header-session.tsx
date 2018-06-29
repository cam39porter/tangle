// React
import * as React from "react";

// Router
import { RouteComponentProps, withRouter } from "react-router";

// Components
import ButtonExit from "../buttons/button-exit";
import Header from "./header";
// Utils

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {}

interface State {}

class HeaderSurface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Header
        left={
          <div className={`flex-column justify-around ph2`}>
            Current Collection
          </div>
          /* tslint:disable-next-line */
        }
        right={
          <div
            className={`flex-column justify-around ph2`}
            onClick={() => {
              this.props.history.push(`/${this.props.location.search}`);
            }}
          >
            <div>
              <ButtonExit />
            </div>
          </div>
          /* tslint:disable-next-line */
        }
      />
    );
  }
}
export default withRouter(HeaderSurface);
