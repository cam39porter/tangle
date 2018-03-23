import * as React from "react";

export interface Props {
  body: string;
  onClick: () => void;
  accentColor: string;
}

class ListItem extends React.Component<Props, object> {
  render() {
    return (
      <div className={`min-measure bg-white bb b--light-gray dt`}>
        <p
          className={`dtc fl ma3 h3 measure-narrow f6 overflow-hidden overflow-scroll overflow-x-hidden`}
        >
          {this.props.body}
        </p>
        <div
          className={`dtc fr ma3 h2 w2 br-100`}
          style={{ backgroundColor: this.props.accentColor }}
        />
      </div>
    );
  }
}

export default ListItem;
