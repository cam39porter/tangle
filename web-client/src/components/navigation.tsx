// React
import * as React from "react";

// Components
import ButtonHome from "./button-home";
import ButtonZap from "./button-zap";
import ButtonSurprise from "./button-surprise";
import ButtonSettings from "./button-settings";
// import ButtonImport from "./button-import";
// import BulkImport from "./bulk-import";
// import ButtonSurface from "./button-surface";

// Utils
import { noop } from "lodash";

interface Props {}

interface State {
  isShowingSettings: boolean;
  isShowingImport: boolean;
}

class NavigationSurprise extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isShowingSettings: false,
      isShowingImport: false
    };
  }

  render() {
    return (
      <div className={`flex bg-dark-gray light-gray br4`}>
        <div className={`flex flex-grow`}>
          <div className={`pa2 dim`}>
            <ButtonHome onClick={noop} />
          </div>
          <div className={`pa2 dim`}>
            <ButtonZap onClick={noop} />
          </div>
          <div className={`pa2 dim`}>
            <ButtonSurprise onClick={noop} />
          </div>
        </div>
        <div className={`pa2 dim`} data-tip={`Your settings`}>
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
    );
  }
}
export default NavigationSurprise;
