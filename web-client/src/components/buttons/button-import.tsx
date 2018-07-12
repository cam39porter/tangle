// React
import * as React from "react";

// Components
import { Upload } from "react-feather";

interface Props {}

const ButtonClear = (props: Props) => {
  return (
    <span className={`flex-column justify-around pointer`}>
      <Upload size={16} />
    </span>
  );
};

export default ButtonClear;
