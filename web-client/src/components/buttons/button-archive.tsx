// React
import * as React from "react";

// Components
import { Trash } from "react-feather";

interface Props {}

const ButtonArchive = (props: Props) => {
  return (
    <span className={`flex-column justify-around pointer`}>
      <Trash size={16} />
    </span>
  );
};

export default ButtonArchive;
