// React
import * as React from "react";

// Components

// Types
interface Props {
  children: React.ReactNode;
}

interface State {}

// Class
class Help extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    return (
      <div
        className={`vh-75 w-100 flex-column items-center justify-around bg-near-white`}
      >
        {this.props.children}
      </div>
    );
  }
}

// Export
export default Help;
