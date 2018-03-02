import * as React from "react";

import NavigationBarTab from "./navigation-bar-tab";

export interface Props {}

function NavigationBar(props: Props) {
  return (
    <div className={`w-100 f6`}>
      <NavigationBarTab title="tangle" />
      <NavigationBarTab title="capture" />
      <NavigationBarTab title="surface" />
      <NavigationBarTab title="reflect" />
    </div>
  );
}

export default NavigationBar;
