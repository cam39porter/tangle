// React
import * as React from "react";

// Components
import InputCapture from "../components/input-capture";

// Types
interface Props {}

interface State {}

// Class
class Capture extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    return (
      <div
        className={`vh-100 flex-column items-center justify-around bg-light-gray`}
      >
        <div className={`pa3 br4 bg-white`} style={{ minWidth: "35em" }}>
          <InputCapture />
        </div>
      </div>
    );
  }
}

// Export
export default Capture;
