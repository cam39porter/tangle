// React
import * as React from "react";

// Route
import { RouteComponentProps } from "react-router";

// Components

// Utils
import { User } from "firebase";
import { ErrorsUtils } from "../utils/index";

// Types
interface Props extends RouteComponentProps<{}> {
  user: User | null;
}

interface State {
  emailSent: boolean;
}

// Class
class Settings extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      emailSent: false
    };
  }

  render() {
    const { user, location } = this.props;
    const { emailSent } = this.state;

    return (
      <div className={`dt vh-100 w-100 bg-near-white`}>
        <div className={`dtc v-mid`}>
          <div className={`center measure pa4 bg-white br4 shadow-1 tc`}>
            <div>
              <img
                src="https://storage.googleapis.com/usetangle-static-assets/logo.png"
                className={`pa2 bb bw2 b--accent`}
                style={{
                  maxHeight: "5em"
                }}
              />
              {user ? (
                <div className={`lh-copy pv4`}>
                  <div>
                    <p>All we need is for you to verify your email.</p>
                    <p>Once verified you will have full access to Tangle.</p>
                    <p className={`pb4`}>
                      To send the verification email, click below.
                    </p>
                    {emailSent ? (
                      <span className={`tc accent`}>
                        Your verification email has been successfully sent.
                      </span>
                    ) : (
                      <span
                        className={`pa3 dim tc br4 bg-accent white pointer`}
                        onClick={() => {
                          user
                            .sendEmailVerification({
                              url:
                                process.env.REACT_APP_ENV === "production"
                                  ? "https://tangleapp.co/"
                                  : process.env.REACT_APP_ENV === "development"
                                    ? "https://dev.tangleapp.co/"
                                    : "http://localhost:3000/"
                            })
                            .then(() => {
                              this.setState({
                                emailSent: true
                              });
                            })
                            .catch(err => {
                              ErrorsUtils.errorHandler.report(
                                err.message,
                                err.stack
                              );
                            });
                        }}
                      >
                        Send Email
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p>Uh oh. We messed up.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Export
export default Settings;
