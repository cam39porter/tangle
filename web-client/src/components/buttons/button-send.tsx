// React
import * as React from "react";

// Components
import { Send } from "react-feather";

interface Props {}

const ButtonSend = (props: Props) => {
  return (
    <span className={`flex-column justify-around`}>
      <Send size={16} />
    </span>
  );
};

export default ButtonSend;
