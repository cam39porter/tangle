// React
import * as React from "react";

// Components
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

// Route
import { RouteProps } from "react-router";

// Config / Utils
import { firebaseAuth } from "../utils";

interface Props extends RouteProps {}

interface State {}

class Login extends React.Component<Props, State> {
  render() {
    return (
      <div className={`dt vh-100 w-100`}>
        <div className={`dtc v-mid`}>
          <div className={``}>
            <StyledFirebaseAuth
              firebaseAuth={firebaseAuth()}
              uiConfig={{
                signInOptions: [
                  firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
                  firebaseAuth.EmailAuthProvider.PROVIDER_ID
                ],
                signInSuccessUrl: `${
                  this.props.location
                    ? this.props.location.pathname + this.props.location.search
                    : "/"
                }`
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
