// React
import * as React from "react";

// Components
import { Trash } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonArchive = (props: Props) => {
  return (
    <span
      className={`flex-column pa2 justify-around pointer`}
      onClick={props.onClick}
    >
      <Trash size={16} />
    </span>
  );
};

export default ButtonArchive;
