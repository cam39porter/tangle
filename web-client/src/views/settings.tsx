// React
import * as React from "react";

// Components
import DataUsage from "../components/help/data-usage";

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
                <span className={``}>Data Limit</span>
              </div>
              <DataUsage />
            </div>
            <div className={`pv3 flex-column`}>
              <div>
                <span
                  className={`pointer bb b--accent dim`}
                  onClick={() => {
                    window.location.href = `https://usetangle.com/blog-guide`;
                  }}
                >
                  How to Guide
                </span>
                <div className={`pt2 f6 gray`}>
                  This will take you to basic guide on how to use to Tangle.
                </div>
              </div>
            </div>
            <div className={`pv3 flex-column`}>
              <div>
                <span
                  className={`pointer bb b--accent dim`}
                  onClick={() => {
                    window.location.href = `mailto:alpha@usetangle.com?subject=Account Deletion Request`;
                  }}
                >
                  Delete Account
                </span>
              </div>
              <div className={`pt2 f6 gray`}>
                This will prompt you to send us an email with your account
                deletion request. We will follow up and promptly delete your
                account and any data we have associated with it.
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
