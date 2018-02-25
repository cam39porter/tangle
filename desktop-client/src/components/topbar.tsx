import * as React from "react";

export interface Props {}
function Topbar(props: Props) {
  return (
    <div className={`w-100`}>
      <p className={`w-25 h1 tc dib pointer bg-animate hover-bg-near-white`}>
        profile
      </p>
      <p className={`w-25 h1 tc dib pointer bg-animate hover-bg-near-white`}>
        reflect
      </p>
      <p className={`w-25 h1 tc dib pointer bg-animate hover-bg-near-white`}>
        tangle
      </p>
      <p className={`w-25 h1 tc dib pointer bg-animate hover-bg-near-white`}>
        inspire
      </p>
    </div>
  );
}

export default Topbar;
