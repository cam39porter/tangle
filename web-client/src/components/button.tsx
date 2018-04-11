import * as React from "react";

interface Props {
  title: string;
  onClick: () => void;
  accentColor: string;
}

class Button extends React.Component<Props, object> {
  render() {
    return (
      <span
        className={`pa2 f6 tc pointer ttl br1 ba b--${this.props.accentColor} ${
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
