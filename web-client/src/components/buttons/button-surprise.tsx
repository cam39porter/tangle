// React
import * as React from "react";

// Components
import { Target } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonSurprise = (props: Props) => {
  return (
    <span className={`dt pa2 f6 tc pointer`} onClick={props.onClick}>
      <div className={`dtc v-mid h-100 w-100`}>
        <Target size={16} />
      </div>
    </span>
  );
};

export default ButtonSurprise;
