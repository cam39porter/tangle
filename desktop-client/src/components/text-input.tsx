import * as React from "react";

import Quill from "react-quill";
import "react-quill/dist/quill.core.css";

export interface Props {}

export interface TextInputState {
  value: string;
}

class TextInput extends React.Component<Props, TextInputState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(value: string): void {
    this.setState({ value });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  render() {
    return (
      <div className={`w-100 vh-50 center dt bb measure-narrow`}>
        <div className={`dtc vh-50 v-btm`}>
          <Quill value={this.state.value} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

export default TextInput;
