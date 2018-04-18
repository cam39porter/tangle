// React
import * as React from "react";

interface Props {
  id: string;
  body: string;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  accentColor: string;
  baseColor?: string;
  textColor?: string;
  isFocus: boolean;
  maxHeight?: string;
}

class ResultListItem extends React.Component<Props, object> {
  render() {
    return (
      <div
        className={`bg-${this.props.baseColor ||
          "white"} w-100 pa2 bb b--light-gray dt pointer bg-animate-ns hover-bg-near-white-ns ${this
          .props.textColor || "black"}  ${this.props.isFocus &&
          `bg-${this.props.accentColor}`}`}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onClick={this.props.onClick}
        key={this.props.id}
      >
        <div className={`dt-row ma3 w-100`}>
          <p
            className={`dtc fl ma3 f6 overflow-hidden lh-copy`}
            style={{
              maxHeight: this.props.maxHeight
            }}
          >
            {this.props.body}
          </p>
        </div>
      </div>
    );
  }
}

export default ResultListItem;
