// React
import * as React from "react";

// Components
import { LogOut } from "react-feather";

interface Props {}

const ButtonLogOut = (props: Props) => {
  return (
    <span className={`flex-column justify-around pointer`}>
      <LogOut size={16} />
    </span>
  );
};

export default ButtonLogOut;
