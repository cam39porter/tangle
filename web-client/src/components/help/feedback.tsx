// React
import * as React from "react";

// GraphQL
import {
  sendFeedbackMutation as sendFeedbackResponse,
  sendFeedbackMutationVariables
} from "../../__generated__/types";
import { graphql, compose, MutationFunc } from "react-apollo";
import { sendFeedback } from "../../queries";

// Components
import ChevronUp from "../buttons/button-chevron-up";
import ChevronDown from "../buttons/button-chevron-down";
import ButtonSend from "../buttons/button-send";
import { ErrorsUtils } from "../../utils/index";

// Types
interface Props {
  sendFeedback: MutationFunc<
    sendFeedbackResponse,
    sendFeedbackMutationVariables
  >;
}

interface State {
  feedback: string;
  isMinimized: boolean;
  placeholder: string;
}

const FEEDBACK_PLEASE =
  "Please speak your mind, we appreciate brutal honesty, ruthless candor, etc.";
const THANK_YOU = "Thank you for your feedback!";

// Class
class Feedback extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      feedback: "",
      isMinimized: true,
      placeholder: FEEDBACK_PLEASE
    };
  }

  render() {
    return (
      <div
        className={`flex-column pa1 br2 bg-gray`}
        style={{
          width: "20em"
        }}
      >
        <div
          className={`flex justify-between pa2 near-white pointer`}
          onClick={() => {
            this.setState({
              placeholder: this.state.isMinimized ? FEEDBACK_PLEASE : THANK_YOU,
              isMinimized: !this.state.isMinimized
            });
          }}
        >
          <div>We love feedback!</div>
          {!this.state.isMinimized ? <ChevronDown /> : <ChevronUp />}
        </div>
        {!this.state.isMinimized && (
          <div className={`flex-column h5 pa2 br`}>
            <textarea
              className={`flex-grow pa2 w-100 dark-gray br2 br--top f6 bg-white`}
              style={{
                resize: "none"
              }}
              placeholder={this.state.placeholder}
              value={this.state.feedback}
              onChange={e => {
                this.setState({
                  feedback: e.target.value
                });
              }}
            />
            <div
              className={`flex justify-between w-100 pa2 br2 br--bottom accent bg-white`}
            >
              <div />
              <div
                className={`flex pointer`}
                onClick={() => {
                  if (this.state.feedback) {
                    this.props
                      .sendFeedback({
                        variables: {
                          body: this.state.feedback
                        }
                      })
                      .then(() => {
                        this.setState({
                          feedback: "",
                          placeholder: THANK_YOU
                        });
                      })
                      .catch(err => {
                        ErrorsUtils.errorHandler.report(err.message, err.stack);
                      });
                  }
                }}
              >
                <div className={`flex-column justify-around f6`}>Send</div>
                <div className={`flex-column justify-around ph2`}>
                  <ButtonSend />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const withSendFeedback = graphql<sendFeedbackResponse, Props>(sendFeedback, {
  name: "sendFeedback",
  alias: "withSendFeedback"
});

// Export
export default compose(withSendFeedback)(Feedback);
