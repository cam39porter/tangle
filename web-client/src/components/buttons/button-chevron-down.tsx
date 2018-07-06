// React
import * as React from "react";

// Components
import { ChevronDown } from "react-feather";

interface Props {}

const ButtonChevronDown = (props: Props) => {
  return (
    <span className={`flex-column justify-around`}>
      <ChevronDown size={16} />
    </span>
  );
};

export default ButtonChevronDown;
