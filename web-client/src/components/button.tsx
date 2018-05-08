// React
import * as React from "react";

interface Props {
  title: string | JSX.Element;
  onClick: () => void;
  accentColor: string;
}

const Button = (props: Props) => {
  return (
    <span
      className={`dt pa2 f6 tc pointer ttl br4 ba b--${props.accentColor} ${
        props.accentColor
      }`}
      onClick={props.onClick}
    >
      <div className={`dtc v-mid h-100 w-100`}>{props.title}</div>
    </span>
  );
};

export default Button;
