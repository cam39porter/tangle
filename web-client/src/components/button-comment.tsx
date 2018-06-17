// React
import * as React from "react";

// Components
import { MessageSquare } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonComment = (props: Props) => {
  return (
    <span
      className={`flex-column pa2 justify-around pointer`}
      onClick={props.onClick}
    >
      <MessageSquare size={16} />
    </span>
  );
};

export default ButtonComment;
