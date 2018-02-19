import * as React from "react";
const logo = require("../logo.svg") as string;

export interface Props {}
function Topbar(props: Props) {
  return (
    <div className={`fl w-100 h3 ba`}>
      <img src={logo} className="fl App-logo h3" alt="logo" />
      <h1 className="fl w-80 tc">Welcome to Capture!</h1>
    </div>
  );
}

export default Topbar;
