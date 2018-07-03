// React
import * as React from "react";

// Router
import { RouteComponentProps, withRouter } from "react-router";

// Components
import ButtonExit from "../buttons/button-exit";
import Header from "./header";
import { AnalyticsUtils } from "../../utils/index";
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
              if (this.props.location.pathname.includes("/related")) {
                this.props.history.push(`/`);
              } else {
                let url =
                  this.props.location.pathname + this.props.location.search;
                url = url.replace(this.props.match.url, "");
                this.props.history.push(url);
              }
              AnalyticsUtils.trackEvent({
                category: AnalyticsUtils.Categories.Test,
                action: AnalyticsUtils.Actions.NavigateFromSession,
                label: this.props.match.params["id"]
              });
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
