// React
import * as React from "react";

interface Props {
  title: string | JSX.Element;
  onClick: () => void;
  accentColor: string;
}

class Button extends React.Component<Props, object> {
  render() {
    return (
      <span
        className={`dt center pa2 f6 tc pointer ttl br1 ba b--${
          this.props.accentColor
        } ${this.props.accentColor}`}
        onClick={this.props.onClick}
      >
        <div className={`dtc v-mid h-100 w-100`}>{this.props.title}</div>
      </span>
    );
  }
}

export default Button;
