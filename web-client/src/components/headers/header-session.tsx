// React
import * as React from "react";

// Router
import { RouteComponentProps, withRouter } from "react-router";

// Components
import ButtonArrowLeft from "../buttons/button-arrow-left";
import Header from "./header";

// Utils
import { AnalyticsUtils } from "../../utils/index";

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
            className={`flex-column justify-around ph2 pointer`}
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
                category: AnalyticsUtils.Categories.Session,
                action: AnalyticsUtils.Actions.CloseSession,
                label: decodeURIComponent(this.props.match.params["id"])
              });
            }}
          >
            <div>
              <ButtonArrowLeft />
            </div>
          </div>
          /* tslint:disable-next-line */
        }
      />
    );
  }
}
export default withRouter(HeaderSurface);
