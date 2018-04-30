// React
import * as React from "react";

// Components
import NavigationBarTab from "./navigation-bar-tab";

interface Props {}

function NavigationBar(props: Props) {
  return (
    <div
      className={`dt f6 w-100 shadow-1 br4 bg-white`}
      style={{
        minWidth: "20em"
      }}
    >
      <NavigationBarTab
        title="tangle"
        isInactiveColor={"accent"}
        isActiveBackgroundColor={"accent"}
        borderCurve={"Left"}
      />
      <NavigationBarTab
        title="capture"
        isInactiveColor={"accent"}
        isActiveBackgroundColor={"accent"}
        borderCurve={"None"}
      />
      <NavigationBarTab
        title="surface"
        isInactiveColor={"accent"}
        isActiveBackgroundColor={"accent"}
        borderCurve={"Right"}
      />
    </div>
  );
}

export default NavigationBar;
