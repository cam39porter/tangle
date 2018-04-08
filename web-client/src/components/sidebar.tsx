import * as React from "react";

interface Props {
  renderHeader: () => JSX.Element | null;
  renderBody: () => JSX.Element | null;
  renderFooter: () => JSX.Element | null;
}

class Sidebar extends React.Component<Props, object> {
  render() {
    return (
      <div className={`flex-column flex-grow z-max measure shadow-3`}>
        {/* Header */}
        <div>{this.props.renderHeader()}</div>

        {/* Body */}
        <div
          className={`flex-column flex-grow measure bg-light-gray overflow-auto`}
        >
          {/* Padding to ensure results start below the header*/}
          <div className={`h4 measure`} style={{ minWidth: "30em" }} />

          {this.props.renderBody()}
        </div>

        {/* Footer */}
        <div
          className={`flex-column drawer h3 measure bg-white bt b--light-gray`}
        >
          {this.props.renderFooter()}
        </div>
      </div>
    );
  }
}

export default Sidebar;
