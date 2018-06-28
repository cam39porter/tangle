// React
import * as React from "react";

// Components
import { ChevronsDown, ChevronsUp } from "react-feather";

interface Props {
  onClick: () => void;
  isUp: boolean;
}

const ButtonRelated = (props: Props) => {
  return (
    <span className={`dt pa2 f6 tc pointer`} onClick={props.onClick}>
      <div className={`dtc v-mid h-100 w-100`}>
        {props.isUp ? <ChevronsUp size={16} /> : <ChevronsDown size={16} />}
      </div>
    </span>
  );
};

export default ButtonRelated;
