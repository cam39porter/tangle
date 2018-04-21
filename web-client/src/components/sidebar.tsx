// React
import * as React from "react";

interface Props {
  renderHeader: () => JSX.Element | null;
  renderBody: () => JSX.Element | null;
  renderFooter: () => JSX.Element | null;
}

class Sidebar extends React.Component<Props, object> {
  render() {
    return (
      <div
        className={`z-max w-100 w-third-l h-100 fixed top-0 left-0 bg-light-gray flex flex-column shadow-3 br4`}
      >
        {/* Header */}
        <div>{this.props.renderHeader()}</div>
        {/* Padding to ensure results start below the header*/}
        <div className={`flex-column`} style={{ minHeight: "6rem" }} />

        {/* Body */}
        <div
          className={`flex-column flex-grow w-100 bg-light-gray overflow-auto`}
        >
          {this.props.renderBody()}
        </div>

        {/* Footer */}
        <div className={`flex-column flex-shrink bt b--light-gray`}>
          {this.props.renderFooter()}
        </div>
      </div>
    );
  }
}

export default Sidebar;
