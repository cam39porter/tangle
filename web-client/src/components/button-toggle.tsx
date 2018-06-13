// React
import * as React from "react";

// Components
import { ToggleLeft, ToggleRight } from "react-feather";

interface Props {
  onClick: () => void;
  isRight: boolean;
}

const ButtonToggle = (props: Props) => {
  return (
    <span className={`dt pa2 f6 tc pointer`} onClick={props.onClick}>
      <div className={`dtc v-mid h-100 w-100`}>
        {props.isRight ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
      </div>
    </span>
  );
};

export default ButtonToggle;
