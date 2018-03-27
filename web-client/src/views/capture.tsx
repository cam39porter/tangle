import * as React from "react";

import NavigationBar from "../components/navigation-bar";
import TextInput from "../components/text-input";
import Button from "../components/button";

import * as _ from "lodash";

import config from "../cfg";

import {
  CreateCaptureMutation,
  CreateCaptureMutationVariables
} from "../__generated__/types";
import { CreateCapture as MUTATION } from "../queries";
import { graphql, MutationFunc } from "react-apollo";

export interface Props {
  mutate: MutationFunc<CreateCaptureMutation, CreateCaptureMutationVariables>;
}

export interface CaptureState {
  value: string;
  clearValue: boolean;
}

class Capture extends React.Component<Props, CaptureState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: "",
      clearValue: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCapture = this.handleCapture.bind(this);
    this.updateClearValue = this.updateClearValue.bind(this);
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

  render() {
    return (
      <div className={`w-100 vh-100 relative`}>
        {/* Navigation Bar */}
        <div className={`z-max`}>
          <NavigationBar />
        </div>

        {/* Capture Box */}
        <div
          className={`absolute measure-narrow pa3 shadow-1 br1`}
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "20em"
          }}
        >
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

          {/* Capture Button */}
          <div className={`tc pa3`}>
            <Button
              title="capture"
              onClick={this.handleCapture}
              accentColor={config.captureAccentColor}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(MUTATION)(Capture);
