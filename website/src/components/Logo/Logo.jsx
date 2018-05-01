import * as React from "react";

import ReactSVG from "react-svg";

import config from "../../../data/SiteConfig";

const Logo = props => {
  return (
    <div className={``}>
      <ReactSVG
        path="../../../logos/logo.svg"
        evalScripts="always"
        svgClassName="svg-class-name"
        svgStyle={{ height: "2.5em" }}
        className="wrapper-class-name"
      />
    </div>
  );
};

export default Logo;
