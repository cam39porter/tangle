// React
import * as React from "react";

// Components
import { X } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonClear = (props: Props) => {
  return (
    <span
      className={`flex-column pa2 justify-around pointer`}
      onClick={props.onClick}
    >
      <X size={16} />
    </span>
  );
};

export default ButtonClear;
