// React
import * as React from "react";

// Components
import ScrollContainer from "../components/scroll-container";

interface Props {
  renderHeader: () => JSX.Element | null;
  renderBody: () => JSX.Element | null;
  renderFooter: () => JSX.Element | null;
  scrollToId?: string;
}

class Sidebar extends React.Component<Props, object> {
  _scrollContainer: ScrollContainer | null = null;

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.scrollToId) {
      this.scrollTo(nextProps.scrollToId);
    }
  }

  scrollTo = (id: string) => {
    if (this._scrollContainer) {
      this._scrollContainer.scrollTo(id);
    }
  };

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
        <ScrollContainer
          ref={scrollContainer => (this._scrollContainer = scrollContainer)}
        >
          <div
            className={`flex-column flex-grow w-100 bg-light-gray overflow-auto`}
          >
            {this.props.renderBody()}
          </div>
        </ScrollContainer>

        {/* Footer */}
        <div className={`flex-column flex-shrink bt b--light-gray`}>
          {this.props.renderFooter()}
        </div>
      </div>
    );
  }
}

export default Sidebar;
