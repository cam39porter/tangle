// React
import * as React from "react";

// Components
import { Plus } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonCapture = (props: Props) => {
  return (
    <span
      className={`flex-column pa2 justify-around pointer`}
      onClick={props.onClick}
    >
      <Plus size={16} />
    </span>
  );
};

export default ButtonCapture;
