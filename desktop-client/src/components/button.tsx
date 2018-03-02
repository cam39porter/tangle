import * as React from "react";

export interface Props {
  title: string;
  onClick: () => void;
}

class Button extends React.Component<Props, object> {
  render() {
    return (
      <span className={`pa2 tc pointer ttu ba`} onClick={this.props.onClick}>
        {this.props.title}
      </span>
    );
  }
}

export default Button;
