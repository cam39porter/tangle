// React
import * as React from "react";

// Types
interface Props {
  right: React.ReactNode;
  left: React.ReactNode;
}

const Header = (props: Props) => (
  <div
    className={`flex justify-between ph2 bb bw1 b--light-gray`}
    style={{
      minHeight: "4em",
      userSelect: "none"
    }}
  >
    {props.left}
    {props.right}
  </div>
);

export default Header;
