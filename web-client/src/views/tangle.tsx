import * as React from "react";

import NavigationBar from "../components/navigation-bar";

interface Props {}

class Tangle extends React.Component<Props, object> {
  render() {
    return (
      <div className={`vh-100 w-100`}>
        {/* Navigation Bar */}
        <div className={`z-max`}>
          <NavigationBar />
        </div>
      </div>
    );
  }
}

export default Tangle;
