// React
import * as React from "react";

// Components
import { Star } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonExpand = (props: Props) => {
  return (
    <span className={`dt pa2 f6 tc pointer`} onClick={props.onClick}>
      <div className={`dtc v-mid h-100 w-100`}>
        <Star size={16} />
      </div>
    </span>
  );
};

export default ButtonExpand;
