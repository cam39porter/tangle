// React
import * as React from "react";

// Components
import { ChevronDown, ChevronUp } from "react-feather";

interface Props {
  onClick: () => void;
  isMore: boolean;
}

const ButtonToggle = (props: Props) => {
  return (
    <span className={`dt pa2 f6 tc gray pointer`} onClick={props.onClick}>
      <div className={`dtc v-mid h-100 w-100`}>
        {props.isMore ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>
    </span>
  );
};

export default ButtonToggle;
