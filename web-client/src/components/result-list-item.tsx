import * as React from "react";

export interface Props {
  body: string;
  tags: Array<{ name: string }>;
  onClick: () => void;
  accentColor: string;
}

class ListItem extends React.Component<Props, object> {
  render() {
    return (
      <div
        className={`min-measure bg-white bb b--light-gray dt pointer bg-animate hover-bg-near-white`}
        style={{ minWidth: "30em" }}
      >
        <div className={`dt-row ma2 w-100`}>
          <p
            className={`dtc fl ma3 h3 measure-narrow f6 overflow-hidden overflow-scroll overflow-x-hidden`}
          >
            {this.props.body}
          </p>
          <div className={`dtc fr ma3`}>
            <p
              className={`v-mid fr h2 w2 br-100`}
              style={{ backgroundColor: this.props.accentColor }}
            />
          </div>
        </div>
        <div className={`dt-row ma2 h2 w-100`}>
          {this.props.tags.map((tag, index) => {
            const name = tag.name;
            return (
              <span
                key={`${index}-${name}`}
                className={`f6 ma3 light-blue fw5`}
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

export default ListItem;
