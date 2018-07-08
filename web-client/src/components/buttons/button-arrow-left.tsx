// React
import * as React from "react";

// Components
import { ArrowLeft } from "react-feather";

interface Props {}

const ButtonArrowLeft = (props: Props) => {
  return (
    <span className={`flex-column justify-around`}>
      <ArrowLeft size={16} />
    </span>
  );
};

export default ButtonArrowLeft;
