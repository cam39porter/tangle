// React
import * as React from "react";

// GraphQL
import { LoginMutation, LoginMutationVariables } from "../__generated__/types";
import { Login as LoginGql } from "../queries";
import { graphql, MutationFunc } from "react-apollo";

// Components
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

// Route
import { RouteProps, Redirect } from "react-router";

// Config / Utils
import { firebaseAuth } from "../utils";
import * as firebase from "firebase";

interface Props extends RouteProps {
  login: MutationFunc<LoginMutation, LoginMutationVariables>;
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

  render() {
    if (this.state.loginSuccess) {
      return (
        <Redirect
          to={`${
            this.props.location
              ? this.props.location.pathname + this.props.location.search
              : "/"
          }`}
        />
      );
    }

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
                signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                  let user: firebase.User = authResult.user;

                  user.getIdToken(true).then(idToken => {
                    user.getIdToken(true).then(idToken => {
                      localStorage.setItem("idToken", idToken);
                    });
                    this.props
                      .login()
                      .then(() => {
                        this.setState({
                          loginSuccess: true
                        });
                      })
                      .catch(err => {
                        alert(err);
                      });
                  });

                  // Handle the redirect
                  return false;
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
