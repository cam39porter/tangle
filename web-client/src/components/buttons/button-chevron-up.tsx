// React
import * as React from "react";

// Components
import { ChevronUp } from "react-feather";

interface Props {}

const ButtonChevronUP = (props: Props) => {
  return (
    <span className={`flex-column justify-around`}>
      <ChevronUp size={16} />
    </span>
  );
};

export default ButtonChevronUP;
