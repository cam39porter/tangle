import * as React from "react";

import TextInput from "../components/text-input";

import * as _ from "lodash";

import config from "../cfg";

import { CreateCaptureMutation as Response } from "../__generated__/types";
import { CreateCapture as MUTATION } from "../queries";
import { graphql, ChildProps } from "react-apollo";

interface Props extends ChildProps<{}, Response> {
  handleMinimize: () => void;
}

interface State {
  value: string;
  clearValue: boolean;
}

class CaptureDialogue extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: "",
      clearValue: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCapture = this.handleCapture.bind(this);

    this.updateClearValue = this.updateClearValue.bind(this);

    this.renderMinimizeButton = this.renderMinimizeButton.bind(this);
  }

  updateClearValue(newClearValue: boolean) {
    this.setState({
      clearValue: newClearValue
    });
  }

  handleChange(value: string): void {
    // Trim whitespace (like newlines) from input
    this.setState({
      value: _.trimEnd(value)
    });
  }

  handleCapture() {
    if (!this.props.mutate) {
      return;
    }

    const capture = this.state.value;
    this.setState({
      clearValue: true
    });
    if (capture === "") {
      return;
    }
    this.props.mutate({
      // strip new lines from the value entered
      variables: { body: capture }
    });
  }

  renderMinimizeButton() {
    return (
      <div
        className={`absolute dt h2 w2 f3 b top-1 right-1 pointer z-999 ba br1 bw1 ${
          config.captureAccentColor
        }`}
        onClick={this.props.handleMinimize}
      >
        <div className={`dtc tc v-mid`}>-</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* Capture Box */}
        <div
          className={`measure-narrow relative pa3 shadow-1 br1 bg-white`}
          style={{ minWidth: "20em" }}
        >
          {/* Mimimize Button */}
          {this.renderMinimizeButton()}

          {/* Text Bar */}
          <div className={`h5 w-100 dt pb3`}>
            <div className={`v-btm dtc bb bw1 b--${config.captureAccentColor}`}>
              <TextInput
                handleChange={this.handleChange}
                handleEnterKey={this.handleCapture}
                clearValue={this.state.clearValue}
                updateClearValue={this.updateClearValue}
                placeholder={"What's on your mind..."}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default graphql<Response, Props>(MUTATION)(CaptureDialogue);
