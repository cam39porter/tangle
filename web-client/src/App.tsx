// React
import * as React from "react";

// Style
import "./custom.css";
import "./tachyons.css";
import "react-quill/dist/quill.bubble.css";

// Routing
import { RouteProps } from "react-router";
import { Route, Switch } from "react-router-dom";

// Components
import Login from "./views/login";
import Main from "./views/main";

// Config / Utils
import { firebaseAuth } from "./utils";

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

  componentDidMount() {
    firebaseAuth()
      .setPersistence(firebaseAuth.Auth.Persistence.LOCAL)
      .then(() => {
        this.removeFirebaseListener = firebaseAuth().onIdTokenChanged(user => {
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
        });
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
