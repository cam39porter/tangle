// React
import * as React from "react";

// Components
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

// Route
import { RouteComponentProps } from "react-router";

// Config / Utils
import { FirebaseUtils } from "../utils";

const firebaseAuth = FirebaseUtils.firebaseAuth;

interface Props extends RouteComponentProps<{}> {}

interface State {}

class Login extends React.Component<Props, State> {
  render() {
    return (
      <div className={`dt vh-100 w-100 bg-near-white`}>
        <div className={`dtc v-mid center`}>
          <div className={`tc`}>
            <div>
              <img
                src="https://storage.googleapis.com/usetangle-static-assets/logo.png"
                className={`pa2 bb bw2 b--accent`}
                style={{
                  maxHeight: "5em"
                }}
              />
              <div className={`h3`} />
              <StyledFirebaseAuth
                firebaseAuth={firebaseAuth()}
                uiConfig={{
                  signInOptions: [
                    firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
                    firebaseAuth.EmailAuthProvider.PROVIDER_ID
                  ],
                  signInSuccessUrl: `${
                    this.props.location
                      ? this.props.location.pathname +
                        this.props.location.search
                      : "/"
                  }`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
