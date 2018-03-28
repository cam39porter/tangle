import * as React from "react";

export interface Props {
  title: string;
  onClick: () => void;
  accentColor: string;
}

class Button extends React.Component<Props, object> {
  render() {
    return (
      <span
        className={`pa2 tc pointer ttu br1 ba b--${this.props.accentColor} ${
          this.props.accentColor
        }`}
        onClick={this.props.onClick}
      >
        {this.props.title}
      </span>
    );
  }
}

export default Button;
