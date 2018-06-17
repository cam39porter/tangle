// React
import * as React from "react";

import { RouteComponentProps } from "react-router";

// Components
import ButtonCapture from "./button-capture";
import ButtonExit from "./button-exit";
import ButtonZap from "./button-zap";
import ButtonSettings from "./button-settings";

// Utils
import { noop } from "lodash";
import { NetworkUtils } from "../utils";

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {}

interface State {
  isShowingSettings: boolean;
  isShowingImport: boolean;
}

class HeaderSurface extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isShowingSettings: false,
      isShowingImport: false
    };
  }

  render() {
    const isCapturing = NetworkUtils.getCapture(this.props.location.search)
      ? true
      : false;
    const query = NetworkUtils.getQuery(this.props.location.search);

    return (
      <div className={`flex-column pa2 pt4 bg-dark-gray light-gray`}>
        <div className={`flex-column flex-grow`}>
          <div className={`pa2 dim bg-accent br-100`}>
            {isCapturing ? (
              <ButtonExit
                onClick={() => {
                  this.props.history.push(
                    `${this.props.location.pathname}?${
                      query ? `query=${query}` : ``
                    }`
                  );
                }}
              />
            ) : (
              <ButtonCapture
                onClick={() => {
                  this.props.history.push(
                    `${this.props.location.pathname}?${
                      query ? `query=${query}` : ``
                    }&capture=true`
                  );
                }}
              />
            )}
          </div>
          <div className={`pa2 dim`}>
            <ButtonZap onClick={noop} />
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
export default HeaderSurface;
