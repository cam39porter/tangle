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
      <div className={`flex flex-column w-100 vh-100`}>
        <div className={`flex-grow bg-light-gray`} />
        <div className={`pv2`}>
          <InputCapture
            handleCapture={() => {}}
            handleExpand={() => {}}
            handleTextChange={() => {}}
            clearOnEnter={true}
            allowToolbar={false}
          />
        </div>
      </div>
    );
  }
}

export default ListSession;
