// React
import * as React from "react";

// Components
import { Home } from "react-feather";

interface Props {}

const ButtonHome = (props: Props) => {
  return (
    <span className={`flex-column justify-around pointer`}>
      <Home size={16} />
    </span>
  );
};

export default ButtonHome;
