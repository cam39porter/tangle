// React
import * as React from "react";

// Components
import { CheckSquare } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonCheck = (props: Props) => {
  return (
    <span
      className={`flex-column pa2 justify-around pointer`}
      onClick={props.onClick}
    >
      <CheckSquare size={16} />
    </span>
  );
};

export default ButtonCheck;
