import React from 'react';
import PopupListItem from './PopupListItem';
import PopupExtras from './PopupExtras';
class Popup extends React.Component {
  render() {
    return (
      <div className={``}>
        <h1 className={`f1 tc`}>opit</h1>
        <div className={`pa3 pa5-ns`}>
          <ul className={`list pl0 measure center`}>
            <PopupListItem itemTitle="Bookmark Page" />
            <PopupListItem itemTitle="View Annotations" />
            <PopupListItem itemTitle="Etc." />
          </ul>
          <PopupExtras />
        </div>
      </div>
    );
  }
}
export default Popup;
