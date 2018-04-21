// React
import * as React from "react";

// Components
import NavigationBarTab from "./navigation-bar-tab";

// Config / utils
import config from "../cfg";

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
        isInactiveColor={config.tangleAccentColor}
        isActiveBackgroundColor={config.tangleAccentColor}
      />
      <NavigationBarTab
        title="capture"
        isInactiveColor={config.captureAccentColor}
        isActiveBackgroundColor={config.captureAccentColor}
      />
      <NavigationBarTab
        title="surface"
        isInactiveColor={config.surfaceAccentColor}
        isActiveBackgroundColor={config.surfaceAccentColor}
      />
    </div>
  );
}

export default NavigationBar;
