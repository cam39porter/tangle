// React
import * as React from "react";

// Components
import { X } from "react-feather";

interface Props {}

const ButtonClear = (props: Props) => {
  return (
    <span className={`flex-column justify-around pointer`}>
      <X size={16} />
    </span>
  );
};

export default ButtonClear;
