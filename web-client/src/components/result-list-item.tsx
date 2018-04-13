// React
import * as React from "react";

interface Props {
  id: string;
  body: string;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  accentColor: string;
}

class ResultListItem extends React.Component<Props, object> {
  render() {
    return (
      <div
        className={`bg-white w-100 bb b--light-gray dt pointer bg-animate-ns hover-bg-near-white-ns`}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onClick={this.props.onClick}
        key={this.props.id}
      >
        <div className={`dt-row ma2 w-100`}>
          <p className={`dtc fl ma3 h3 f6 overflow-hidden `} style={{}}>
            {this.props.body}
          </p>
        </div>
      </div>
    );
  }
}

export default ResultListItem;
