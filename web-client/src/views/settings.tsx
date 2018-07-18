// React
import * as React from "react";

// Components

// Utils
import { FirebaseUtils, AnalyticsUtils } from "../utils/index";

// Types
interface Props {}

interface State {}

// Class
class Settings extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    return (
      <div className={`vh-100 w-100 overflow-auto`}>
        <div className={`pa4 measure-wide center dark-gray lh-copy`}>
          <div className={`f4 pv4`}>Settings</div>
          <div className={`flex-column pb4`}>
            <div className={`pv3 flex-column`}>
              <div>
                <span
                  className={`pointer bb b--accent dim`}
                  onClick={() => {
                    const auth = FirebaseUtils.firebaseAuth();
                    const user = auth.currentUser ? auth.currentUser.uid : "";

                    AnalyticsUtils.trackEvent({
                      category: AnalyticsUtils.Categories.Home,
                      action: AnalyticsUtils.Actions.ClickToSignOut,
                      label: user
                    });
                    localStorage.removeItem("idToken");
                    auth.signOut();
                    AnalyticsUtils.setUserId(undefined);
                  }}
                >
                  Sign out
                </span>
              </div>
            </div>
            <div className={`pv3 flex-column`}>
              <div>
                <span
                  className={`pointer bb b--accent dim`}
                  onClick={() => {
                    //
                  }}
                >
                  Delete Account
                </span>
              </div>
              <div className={`pt2 f6`}>
                This will send us an email requesting deletion of your account.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Export
export default Settings;
