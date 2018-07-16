// React
import * as React from "react";

// Router
import { RouteComponentProps, withRouter } from "react-router";

// Components
import ButtonArrowLeft from "../buttons/button-arrow-left";
import Header from "./header";
import TimeAgo from "react-timeago";

// Utils
import { AnalyticsUtils } from "../../utils/index";

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  created: number;
  isSaving: boolean;
}

interface State {}

class HeaderSurface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { created, isSaving } = this.props;

    return (
      <Header
        left={
          <div className={`flex`}>
            <div className={`flex-column justify-around ph2`}>
              <div className={`flex f7`}>
                <span className={`pr1`}>Created</span>
                <span>{new Date(created).toLocaleDateString()}</span>
              </div>
            </div>
            <div className={`flex-column justify-around ph2`}>
              <div className={`flex f7`}>
                {isSaving ? "Saving..." : "Saved"}
              </div>
            </div>
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
