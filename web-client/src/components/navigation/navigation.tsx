// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// Components
import ButtonCapture from "./../buttons/button-capture";
import ButtonExit from "./../buttons/button-exit";
import ButtonLogOut from "../buttons/button-logout";

// Utils
import { NetworkUtils } from "../../utils";
import { FirebaseUtils, AnalyticsUtils } from "../../utils";

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
        <div className={`flex-column flex-grow`}>
          <div
            className={`pa3 dim bg-accent br-100 pointer`}
            onClick={() => {
              if (isCapturing) {
                this.props.history.push(
                  `${this.props.location.pathname}?${
                    query ? `query=${query}` : ``
                  }`
                );
                AnalyticsUtils.trackEvent({
                  category: this.props.location.pathname.includes("collection")
                    ? AnalyticsUtils.Categories.Session
                    : AnalyticsUtils.Categories.Home,
                  action: AnalyticsUtils.Actions.CloseQuickCreate
                });
                return;
              }
              this.props.history.push(
                `${this.props.location.pathname}?${
                  query ? `query=${query}&` : ``
                }capture=true`
              );
              AnalyticsUtils.trackEvent({
                category: this.props.location.pathname.includes("collection")
                  ? AnalyticsUtils.Categories.Session
                  : AnalyticsUtils.Categories.Home,
                action: AnalyticsUtils.Actions.OpenQuickCreate
              });
            }}
          >
            {isCapturing ? <ButtonExit /> : <ButtonCapture />}
          </div>
        </div>
        <div
          className={`flex-column center justify-around pa2 dim pointer`}
          onClick={() => {
            const auth = FirebaseUtils.firebaseAuth();
            const user = auth.currentUser ? auth.currentUser.uid : "";

            AnalyticsUtils.trackEvent({
              category: this.props.location.pathname.includes("collection")
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.ClickToSignOut,
              label: user
            });
            localStorage.removeItem("idToken");
            auth.signOut();
            AnalyticsUtils.setUserId(undefined);
          }}
        >
          <ButtonLogOut />
        </div>
      </div>
    );
  }
}

export default Navigation;
