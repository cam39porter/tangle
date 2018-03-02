import * as React from "react";

import TextInput from "./text-input";
import Button from "../components/button";

export interface Props {}
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
  }

  handleChange(value: string): void {
    this.setState({
      value
    });
  }

  render() {
    return (
      <div>
        <div className={`pa3 w-100 vh-50 center dt measure-narrow`}>
          <div className={`dtc v-btm bb`}>
            <TextInput handleChange={this.handleChange} />
          </div>
        </div>
        <div className={`tc pa3`}>
          <Button
            title="capture"
            onClick={() => {
              alert(this.state.value);
            }}
          />
        </div>
      </div>
    );
  }
}

export default TextInputCapture;
