import * as React from "react";

export interface Props {}
function Topbar(props: Props) {
  return (
    <div className={`w-100 f6`}>
      <p className={`w-25 h1 tc dib pointer`}>profile</p>
      <p className={`w-25 h1 tc dib pointer`}>reflect</p>
      <p className={`w-25 h1 tc dib pointer`}>tangle</p>
      <p className={`w-25 h1 tc dib pointer`}>inspire</p>
    </div>
  );
}

export default Topbar;
