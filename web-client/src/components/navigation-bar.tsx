import * as React from "react";
import config from "../cfg";

import NavigationBarTab from "./navigation-bar-tab";

interface Props {}

function NavigationBar(props: Props) {
  return (
    <div className={`w-100 f6 dt shadow-1`}>
      <div className={`w-one-third dtc dim`}>
        <NavigationBarTab
          title="tangle"
          isActiveColor={"white"}
          isActiveBackgroundColor={config.tangleAccentColor}
        />
      </div>
      <div className={`w-one-third dtc dim`}>
        <NavigationBarTab
          title="capture"
          isActiveColor={"white"}
          isActiveBackgroundColor={config.captureAccentColor}
        />
      </div>
      <div className={`w-one-third dtc dim`}>
        <NavigationBarTab
          title="surface"
          isActiveColor={"white"}
          isActiveBackgroundColor={config.surfaceAccentColor}
        />
      </div>
    </div>
  );
}

export default NavigationBar;
