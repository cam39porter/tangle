// React
import * as React from "react";

// Components
import { Zap } from "react-feather";

interface Props {}

const ButtonZap = (props: Props) => {
  return (
    <span className={`flex-column pa2 justify-around pointer`}>
      <Zap size={16} />
    </span>
  );
};

export default ButtonZap;
