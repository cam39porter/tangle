// React
import * as React from "react";

// Components
import { Plus } from "react-feather";

interface Props {}

const ButtonCapture = (props: Props) => {
  return (
    <span className={`flex-column pa2 justify-around pointer`}>
      <Plus size={16} />
    </span>
  );
};

export default ButtonCapture;
