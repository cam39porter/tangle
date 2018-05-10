// React
import * as React from "react";

// Components
import InputCapture from "./input-capture";

// Utils

// Types

interface Props {}

interface State {}

class ListSession extends React.Component<Props, State> {
  render() {
    return (
      <div className={`w-100 vh-100`}>
        <InputCapture
          handleCapture={() => {}}
          handleExpand={() => {}}
          handleTextChange={() => {}}
          clearOnEnter={true}
          allowToolbar={false}
        />
      </div>
    );
  }
}

export default ListSession;
