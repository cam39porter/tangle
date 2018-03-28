import * as React from "react";
import config from "../cfg";

import NavigationBarTab from "./navigation-bar-tab";

export interface Props {}

function NavigationBar(props: Props) {
  return (
    <div className={`w-100 f6 dt`}>
      <div className={`w-one-third dtc`}>
        <NavigationBarTab
          title="tangle"
          isActiveColor={config.tangleAccentColor}
          isActiveBackgroundColor={"white"}
        />
      </div>
      <div className={`w-one-third dtc`}>
        <NavigationBarTab
          title="capture"
          isActiveColor={config.captureAccentColor}
          isActiveBackgroundColor={"white"}
        />
      </div>
      <div className={`w-one-third dtc `}>
        <NavigationBarTab
          title="surface"
          isActiveColor={config.surfaceAccentColor}
          isActiveBackgroundColor={"white"}
        />
      </div>
    </div>
  );
}

export default NavigationBar;
