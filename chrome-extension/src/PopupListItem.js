import React from 'react';

class PopupListItem extends React.Component {
  render() {
    return (
      <li className="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
        <a href="#" className="link dim gray">
          {this.props.itemTitle}
        </a>
      </li>
    );
  }
}
export default PopupListItem;
