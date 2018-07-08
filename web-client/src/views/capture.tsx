// React
import * as React from "react";

// Components
import CardCapture from "../components/cards/card-capture";

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
        className={`vh-100 flex-column items-center justify-around bg-light-gray overflow-auto`}
      >
        <div
          style={{
            minWidth: "30em"
          }}
        >
          <CardCapture />
        </div>
      </div>
    );
  }
}

// Export
export default Capture;
