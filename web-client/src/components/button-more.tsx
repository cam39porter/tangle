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
    <span
      className={`flex-column pa2 justify-around pointer`}
      onClick={props.onClick}
    >
      {props.isMore ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
    </span>
  );
};

export default ButtonToggle;
