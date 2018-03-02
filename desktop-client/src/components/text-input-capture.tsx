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
}

class TextInputCapture extends React.Component<Props, TextInputCaptureState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCapture = this.handleCapture.bind(this);
  }

  handleChange(value: string): void {
    this.setState({
      value
    });
  }

  handleCapture() {
    this.props.mutate({
      variables: { body: this.state.value }
    });
  }

  render() {
    return (
      <div>
        <div className={`pa3 w-100 vh-50 center dt measure-narrow`}>
          <div className={`dtc v-btm bb`}>
            <TextInput
              handleChange={this.handleChange}
              handleEnterKeyUp={this.handleCapture}
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
