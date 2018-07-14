// React
import * as React from "react";

// Components

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
        className={`vh-100 flex-column items-center justify-around bg-transparent overflow-auto`}
      >
        test
      </div>
    );
  }
}

// Export
export default Capture;
