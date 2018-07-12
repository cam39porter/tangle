// React
import * as React from "react";

// Router
import { RouteComponentProps, withRouter } from "react-router";

// Components
import InputSurface from "../inputs/input-surface";
import InputFileUpload from "../inputs/input-file-upload";
import Header from "./header";
import { AnalyticsUtils } from "../../utils/index";

// Utils

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  isGraphView: boolean;
  handleIsGraphView: () => void;
}

interface State {
  showLegend: boolean;
}

class HeaderSurface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showLegend: true
    };
  }

  render() {
    const { isGraphView, handleIsGraphView, location, match } = this.props;

    return (
      <Header
        left={
          isGraphView ? (
            <div className={`flex-column justify-around`}>
              <div className={`flex f7`}>
                {location.pathname.includes("collection/") && (
                  <div className={`flex pa2`}>
                    <div className={`br-100 bg-base h1 w1`} />
                    <div className={`ph2`}>current collection</div>
                  </div>
                )}
                {location.pathname.includes("/recent") && (
                  <div className={`flex pa2`}>
                    <div className={`br-100 bg-accent h1 w1`} />
                    <div className={`ph2`}>recently modified</div>
                  </div>
                )}
                {location.pathname.includes("/search") && (
                  <div className={`flex pa2`}>
                    <div className={`br-100 bg-accent h1 w1`} />
                    <div className={`ph2`}>search result</div>
                  </div>
                )}
                <div className={`flex pa2`}>
                  <div className={`br-100 bg-moon-gray h1 w1`} />
                  <div className={`ph2`}>related</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex-column justify-around`}>
              <InputFileUpload />
            </div>
          )
        }
        right={
          <React.Fragment>
            <div className={`flex`}>
              <div className={`flex-column justify-around`}>
                <div
                  className={`pa2 pointer ${
                    isGraphView ? "br4 bg-accent light-gray" : ""
                  }`}
                  onClick={() => {
                    handleIsGraphView();
                    AnalyticsUtils.trackEvent({
                      category: match.params["id"]
                        ? AnalyticsUtils.Categories.Session
                        : AnalyticsUtils.Categories.Home,
                      action: isGraphView
                        ? AnalyticsUtils.Actions.NavigateFromGraph
                        : AnalyticsUtils.Actions.NavigateToGraph
                      //  TODO: label: search=query pivot=id recent
                    });
                  }}
                >
                  <div className={`bb b--accent`}>Visualize</div>
                </div>
              </div>
            </div>
            <div
              className={`pl2 flex-column justify-around`}
              style={{
                minWidth: "20em"
              }}
            >
              <InputSurface />
            </div>
          </React.Fragment>
          /* tslint:disable-next-line */
        }
      />
    );
  }
}
export default withRouter(HeaderSurface);
