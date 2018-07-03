// React
import * as React from "react";

// Router
import { RouteComponentProps, withRouter } from "react-router";

// Components
import InputSurface from "../inputs/input-surface";
import Header from "./header";
import { AnalyticsUtils } from "../../utils/index";
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
        left={null}
        right={
          <React.Fragment>
            <div className={`flex`}>
              <div className={`flex-column justify-around`}>
                <div
                  className={`pa2 pointer ${
                    this.props.isGraphView ? "br4 bg-accent light-gray" : ""
                  }`}
                  onClick={() => {
                    this.props.handleIsGraphView();
                    AnalyticsUtils.trackEvent({
                      category: AnalyticsUtils.Categories.Test,
                      action: this.props.isGraphView
                        ? AnalyticsUtils.Actions.NavigateFromGraph
                        : AnalyticsUtils.Actions.NavigateToGraph
                      // TODO: label: search=query related=id recent
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
