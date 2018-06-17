// React
import * as React from "react";

// Components
import { Edit } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonEdit = (props: Props) => {
  return (
    <span
      className={`flex-column pa2 justify-around pointer`}
      onClick={props.onClick}
    >
      <Edit size={16} />
    </span>
  );
};

export default ButtonEdit;
