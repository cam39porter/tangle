import * as React from "react";

import TextInput from "./text-input";
import Button from "../components/button";

import {
  CreateCaptureMutation,
  CreateCaptureMutationVariables
} from "../__generated__/types";
import { CreateCapture as MUTATION } from "../queries";
import { graphql, MutationFunc } from "react-apollo";

export interface Props {
  mutate: MutationFunc<CreateCaptureMutation, CreateCaptureMutationVariables>;
}

export interface TextInputCaptureState {
  value: string;
  clearValue: boolean;
}

class TextInputCapture extends React.Component<Props, TextInputCaptureState> {
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
    this.setState({
      value
    });
  }

  handleCapture() {
    const capture = this.state.value.replace(/\n/g, "");
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
      <div>
        {/* Text Bar */}
        <div className={`pa3 w-100 vh-100 vh-50-ns center dt measure-narrow`}>
          <div className={`dtc asf v-btm bb`}>
            <TextInput
              handleChange={this.handleChange}
              handleEnterKey={this.handleCapture}
              clearValue={this.state.clearValue}
              updateClearValue={this.updateClearValue}
              placeholder={"Let's Tangle..."}
            />
          </div>
        </div>
        {/* Capture Button */}
        <div className={`tc pa3 clip-s`}>
          <Button title="capture" onClick={this.handleCapture} />
        </div>
      </div>
    );
  }
}

export default graphql(MUTATION)(TextInputCapture);
