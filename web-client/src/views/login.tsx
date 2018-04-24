// React
import * as React from "react";

// GraphQL
import { LoginMutation } from "../__generated__/types";
import { Login as LoginGql } from "../queries";
import { graphql, MutationFunc } from "react-apollo";

// Components
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

// Route
import { RouteComponentProps } from "react-router";

// Config / Utils
import { firebaseAuth } from "../utils";
import * as firebase from "firebase";

interface Props extends RouteComponentProps<{}> {
  login: MutationFunc<LoginMutation, {}>;
}

interface State {
  loginSuccess: boolean;
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loginSuccess: false
    };
  }

  handleLoginSuccess = (user: firebase.User) => {
    user.getIdToken(true).then(idToken => {
      localStorage.setItem("idToken", idToken);
      this.props.login({}).catch(err => {
        alert(err);
        localStorage.removeItem("idToken");
        if (this.props.history) {
          this.props.history.push("/login");
        }
      });
    });
  };

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
                }`,
                callbacks: {
                  signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                    let user: firebase.User = authResult.user;

                    this.handleLoginSuccess(user);

                    return true;
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default graphql<LoginMutation, Props>(LoginGql, {
  name: "login"
})(Login);
