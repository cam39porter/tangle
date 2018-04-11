import * as React from "react";

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { firebaseAuth } from "../utils";

interface Props {}

class Login extends React.Component<Props, object> {
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
                signInSuccessUrl: "/surface"
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
