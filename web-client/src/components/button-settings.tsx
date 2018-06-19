// React
import * as React from "react";

// Components
import { Settings } from "react-feather";

interface Props {}

const ButtonSettings = (props: Props) => {
  return (
    <span className={`flex-column pa2 justify-around pointer`}>
      <Settings size={16} />
    </span>
  );
};

export default ButtonSettings;
