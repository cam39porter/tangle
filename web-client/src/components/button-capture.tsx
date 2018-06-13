// React
import * as React from "react";

// Components
import { Plus } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonCapture = (props: Props) => {
  return (
    <span className={`dt pa2 f6 tc pointer`} onClick={props.onClick}>
      <div className={`dtc v-mid h-100 w-100`}>
        <Plus size={16} />
      </div>
    </span>
  );
};

export default ButtonCapture;
