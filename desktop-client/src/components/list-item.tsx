import * as React from "react";

export interface Props {
  body: string;
  onClick: () => void;
  accentColor: string;
}

class ListItem extends React.Component<Props, object> {
  render() {
    return (
      <div className={`measure bg-white bb b--light-gray`}>
        <p className={`ma3 h3 left measure-narrow f6`}>{this.props.body}</p>
      </div>
    );
  }
}

export default ListItem;
