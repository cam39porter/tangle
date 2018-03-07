import * as React from "react";

import NavigationBar from "../components/navigation-bar";

export interface Props {}

class Tangle extends React.Component<Props, object> {
  render() {
    return (
      <div className={`vh-100 w-100`}>
        {/* Navigation Bar */}
        <div className={`clip-s z-max`}>
          <NavigationBar />
        </div>
      </div>
    );
  }
}

export default Tangle;
