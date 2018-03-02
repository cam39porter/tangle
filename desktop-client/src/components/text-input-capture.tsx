import * as React from "react";

import TextInput from "./text-input";

export interface Props {}

class TextInputCapture extends React.Component<Props, object> {
  render() {
    return (
      <div className={``}>
        <TextInput />
      </div>
    );
  }
}

export default TextInputCapture;
