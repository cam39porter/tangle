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
import ReactToolTip from "react-tooltip";

interface Props {
  handleHome: () => void;
  handleSurprise: () => void;
  handleSession: () => void;
}

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
          <div
            className={`pa2 dim`}
            data-tip={`View your most recent captures`}
          >
            <ButtonHome onClick={this.props.handleHome} />
          </div>
          <div className={`pa2 dim`} data-tip={`Start a new brainstorm`}>
            <ButtonZap onClick={this.props.handleSession} />
          </div>
          <div
            className={`pa2 dim`}
            data-tip={`Surprise me with a random capture`}
          >
            <ButtonSurprise onClick={this.props.handleSurprise} />
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
        <ReactToolTip />
      </div>
    );
  }
}
export default NavigationSurprise;
