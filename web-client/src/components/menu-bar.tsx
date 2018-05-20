// React
import * as React from "react";

// Components
import ButtonSettings from "./button-settings";
import ButtonImport from "./button-import";
import BulkImport from "./bulk-import";
import ReactTooltip from "react-tooltip";

// Utils
import { FirebaseUtils } from "../utils";

// Types
interface Props {}

interface State {
  isShowingSettings: boolean;
  isShowingImport: boolean;
}

class MenuBar extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      isShowingSettings: false,
      isShowingImport: false
    };
  }

  render() {
    return (
      <div className={``}>
        <div className={``}>
          <div className={`fr dt pa2 br4 shadow-1 bg-white`}>
            <div
              className={`dtc pa2 center br4 ${this.state.isShowingImport &&
                "bg-light-gray"}`}
              data-tip={`import your data`}
            >
              <ButtonImport
                onClick={() => {
                  this.setState({
                    isShowingSettings: false,
                    isShowingImport: !this.state.isShowingImport
                  });
                }}
              />
            </div>
            <div
              className={`dtc pa2 center br4 ${this.state.isShowingSettings &&
                "bg-light-gray"}`}
              data-tip={`manage your settings`}
            >
              <ButtonSettings
                onClick={() => {
                  this.setState({
                    isShowingImport: false,
                    isShowingSettings: !this.state.isShowingSettings
                  });
                }}
              />
            </div>
          </div>
        </div>
        {(this.state.isShowingSettings || this.state.isShowingImport) && (
          <div className={`fr mt3 pa2 br4 shadow-1 bg-white`}>
            {this.state.isShowingSettings && (
              <div
                className={`dt`}
                style={{
                  minWidth: "10em"
                }}
              >
                <div className={`dt-row`}>
                  <div className={`dtc pa2 br4 dark-gray f4`}>Settings</div>
                </div>
                <div className={`dt-row`}>
                  <div
                    className={`dtc pa2 br4 gray f5 pointer`}
                    onClick={() => {
                      localStorage.removeItem("idToken");
                      FirebaseUtils.firebaseAuth().signOut();
                    }}
                  >
                    Sign out
                  </div>
                </div>
              </div>
            )}
            {this.state.isShowingImport && (
              <div
                className={`dt`}
                style={{
                  minWidth: "10em"
                }}
              >
                <div className={`dt-row`}>
                  <div className={`dtc pa2 br4 dark-gray f4`}>Import</div>
                </div>
                <div className={`dt-row`}>
                  <div className={`dtc pa2 br4 gray f5`}>
                    <BulkImport />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <ReactTooltip />
      </div>
    );
  }
}

export default MenuBar;
