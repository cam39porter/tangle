import * as React from "react";

interface Props {
  id: string;
  body: string;
  tags: Array<{ name: string }>;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  accentColor: string;
  nodeColor: string;
}

class ResultListItem extends React.Component<Props, object> {
  render() {
    return (
      <div
        className={`bg-white bb b--light-gray dt pointer bg-animate hover-bg-near-white`}
        style={{ minWidth: "30em" }}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onClick={this.props.onClick}
        key={this.props.id}
      >
        <div className={`dt-row ma2 w-100`}>
          <p className={`dtc fl ma3 h3 measure-narrow f6 overflow-hidden`}>
            {this.props.body}
          </p>
          <div className={`dtc fr ma3`}>
            <p
              className={`v-mid fr h2 w2 br-100`}
              style={{ backgroundColor: this.props.nodeColor }}
            />
          </div>
        </div>
        <div className={`dt-row ma2 h2 w-100`}>
          {this.props.tags.map((tag, index) => {
            const name = tag.name;
            return (
              <span
                key={`${index}-${name}`}
                className={`f6 ma3 ${this.props.accentColor} fw5`}
              >
                {`#${name}`}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ResultListItem;
