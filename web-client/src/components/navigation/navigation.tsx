// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// Components
import ButtonCapture from "./../buttons/button-capture";
import ButtonExit from "./../buttons/button-exit";
import ButtonSettings from "./../buttons/button-settings";

// Utils
import { NetworkUtils } from "../../utils";
import { FirebaseUtils } from "../../utils";

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {}

interface State {}

class Navigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const isCapturing = NetworkUtils.getCapture(this.props.location.search)
      ? true
      : false;
    const query = NetworkUtils.getQuery(this.props.location.search);

    return (
      <div
        className={`flex-column pa2 bg-dark-gray light-gray`}
        style={{
          userSelect: "none"
        }}
      >
        <div style={{ minHeight: "4em" }} />
        <div className={`flex-column flex-grow`}>
          <div
            className={`pa2 dim bg-accent br-100 pointer`}
            onClick={() => {
              if (isCapturing) {
                this.props.history.push(
                  `${this.props.location.pathname}?${
                    query ? `query=${query}` : ``
                  }`
                );
                return;
              }
              this.props.history.push(
                `${this.props.location.pathname}?${
                  query ? `query=${query}&` : ``
                }capture=true`
              );
            }}
          >
            {isCapturing ? <ButtonExit /> : <ButtonCapture />}
          </div>
        </div>
        <div
          className={`pa2 dim pointer`}
          onClick={() => {
            localStorage.removeItem("idToken");
            FirebaseUtils.firebaseAuth().signOut();
          }}
        >
          <ButtonSettings />
        </div>
      </div>
    );
  }
}

export default Navigation;
