import React from 'react';

class PopupExtras extends React.Component {
  render() {
    return (
      <div className={`tc pb3`}>
        <a
          className={`link dim gray f6 f5-ns dib mr3`}
          href="#"
          title="Options"
        >
          Options
        </a>
        <a
          className={`link dim gray f6 f5-ns dib mr3`}
          href="#"
          title="Explore"
        >
          Explore
        </a>
        <a className={`link dim gray f6 f5-ns dib`} href="#" title="Feedback">
          Feedback
        </a>
      </div>
    );
  }
}
export default PopupExtras;
