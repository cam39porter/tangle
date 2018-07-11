// React
import * as React from "react";

// Style
import "./css/custom.css";
import "./tachyons.css";
import "draft-js/dist/Draft.css";

// Routing
import { RouteProps, Redirect } from "react-router";
import { Route, Switch } from "react-router-dom";

// Components
import Settings from "./views/settings";
import Login from "./views/login";
import Main from "./views/main";

// Config / Utils
import { FirebaseUtils, AnalyticsUtils, ErrorsUtils } from "./utils";

// Types
import { User } from "firebase";

interface Props extends RouteProps {}

interface State {
  isAuthenticated: boolean | null;
  isEmailVerified: boolean | null;
  user: User | null;
}

class App extends React.Component<Props, State> {
  removeFirebaseListener: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      isAuthenticated: null,
      isEmailVerified: null,
      user: null
    };
  }

  setUserIdToken = (user: User) => {
    user.getIdToken(true).then(idToken => {
      localStorage.setItem("idToken", idToken);
      AnalyticsUtils.setUserId(user.uid);
      this.setState({
        isAuthenticated: true,
        isEmailVerified: user.emailVerified,
        user: user
      });
    });
  };

  componentWillMount() {
    FirebaseUtils.firebaseAuth()
      .setPersistence(FirebaseUtils.firebaseAuth.Auth.Persistence.LOCAL)
      .then(() => {
        this.removeFirebaseListener = FirebaseUtils.firebaseAuth().onIdTokenChanged(
          user => {
            if (user) {
              this.setUserIdToken(user);
            } else {
              this.setState({
                isAuthenticated: false
              });
            }
          }
        );
      })
      .catch(err => {
        ErrorsUtils.errorHandler.report(err.message, err.stack);
      });
  }
  componentWillUnmount() {
    this.removeFirebaseListener();
  }

  render() {
    const { isAuthenticated, isEmailVerified, user } = this.state;
    return (
      <div className={`vh-100 w-100 sans-serif`}>
        {isAuthenticated === null ? null : (
          <div>
            {isAuthenticated ? (
              isEmailVerified === null ? null : (
                <div>
                  {!isEmailVerified ? (
                    <Switch>
                      <Route
                        path="/settings"
                        render={props => <Settings {...props} user={user} />}
                      />
                      <Redirect to="/settings" />
                    </Switch>
                  ) : (
                    <Route
                      path="/"
                      component={AnalyticsUtils.withTracker(Main)}
                    />
                  )}
                </div>
              )
            ) : (
              <Route to="/" component={Login} />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
