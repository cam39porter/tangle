// React
import * as React from "react";

// Components
import { ZapOff } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonContract = (props: Props) => {
  return (
    <span className={`dt pa2 f6 tc pointer`} onClick={props.onClick}>
      <div className={`dtc v-mid h-100 w-100`}>
        <ZapOff size={16} />
      </div>
    </span>
  );
};

export default ButtonContract;
