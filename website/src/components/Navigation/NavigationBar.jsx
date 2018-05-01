import * as React from "react";

import config from "../../../data/SiteConfig";

import Logo from "../../components/Logo/Logo";

const NavigationBar = props => {
  return (
    <div className={`w-100`}>
      <Logo />
    </div>
  );
};

export default NavigationBar;
