// React
import * as React from "react";

// Style
import "./custom.css";
import "./tachyons.css";
import "draft-js/dist/Draft.css";

// Routing
import { RouteProps } from "react-router";
import { Route, Switch } from "react-router-dom";

// Components
import Login from "./views/login";
import Main from "./views/main";

// Config / Utils
import { FirebaseUtils } from "./utils";
import * as ReactGA from "react-ga";
interface Props extends RouteProps {}

interface State {
  isAuthenticated: boolean | null;
}

class App extends React.Component<Props, State> {
  removeFirebaseListener: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      isAuthenticated: null
    };
  }

  componentWillMount() {
    ReactGA.pageview("test");
  }

  componentDidUpdate(prevProps: object) {
    // TODO pass in valuable data here
    ReactGA.pageview("page view");
  }

  componentDidMount() {
    ReactGA.initialize("UA-121634830-1");
    FirebaseUtils.firebaseAuth()
      .setPersistence(FirebaseUtils.firebaseAuth.Auth.Persistence.LOCAL)
      .then(() => {
        this.removeFirebaseListener = FirebaseUtils.firebaseAuth().onIdTokenChanged(
          user => {
            if (user) {
              user.getIdToken(true).then(idToken => {
                localStorage.setItem("idToken", idToken);
              });

              this.setState({
                isAuthenticated: true
              });
            } else {
              this.setState({
                isAuthenticated: false
              });
            }
          }
        );
      })
      .catch(err => {
        alert(err);
      });
  }
  componentWillUnmount() {
    this.removeFirebaseListener();
  }

  render() {
    return (
      <div className={`vh-100 w-100 avenir`}>
        {this.state.isAuthenticated === null ? null : (
          <div>
            {this.state.isAuthenticated ? (
              <Switch>
                <Route path="/" component={Main} />
              </Switch>
            ) : (
              <Switch>
                <Route to="/" component={Login} />
              </Switch>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
