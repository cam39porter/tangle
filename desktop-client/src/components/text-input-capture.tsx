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
    this.setState({
      clearValue: true
    });
    this.props.mutate({
      // strip new lines from the value entered
      variables: { body: this.state.value.replace(/\n/g, "") }
    });
  }

  render() {
    return (
      <div>
        <div className={`pa3 w-100 vh-50 center dt measure-narrow`}>
          <div className={`dtc v-btm bb`}>
            <TextInput
              handleChange={this.handleChange}
              handleEnterKey={this.handleCapture}
              clearValue={this.state.clearValue}
              updateClearValue={this.updateClearValue}
              placeholder={"Let's Tangle..."}
            />
          </div>
        </div>
        <div className={`tc pa3`}>
          <Button title="capture" onClick={this.handleCapture} />
        </div>
      </div>
    );
  }
}

export default graphql(MUTATION)(TextInputCapture);
