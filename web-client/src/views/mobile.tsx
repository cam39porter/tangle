// React
import * as React from "react";

// Components
import ButtonLogOut from "../components/buttons/button-logout";

// Utils
import { FirebaseUtils, AnalyticsUtils } from "../utils";

// Types
interface Props {}

interface State {}

// Class
class Mobile extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    return (
      <div className={`pa3 vh-100 w-100 center`}>
        <div className={` flex justify-between`}>
          <div className={`flex-grow`}>
            <img
              src="https://storage.googleapis.com/usetangle-static-assets/logo.png"
              className={`pa2 bb bw2 b--accent`}
              style={{
                maxHeight: "2.5em"
              }}
            />
          </div>
          <div
            className={`flex-column center justify-around pa2 dim pointer`}
            onClick={() => {
              const auth = FirebaseUtils.firebaseAuth();
              const user = auth.currentUser ? auth.currentUser.uid : "";

              AnalyticsUtils.trackEvent({
                category: AnalyticsUtils.Categories.Mobile,
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
        <div className={`flex-column dark-gray`}>
          <p>We do not currently support a mobile experience.</p>
        </div>
      </div>
    );
  }
}

// Export
export default Mobile;
