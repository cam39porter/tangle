import * as React from "react";

import Chevron from "../components/chevron";

interface Props {
  totalResults: number;
  startIndex: number;
  endIndex: number;
  isActivePageUp: boolean;
  handlePageUp: () => void;
  isActivePageDown: boolean;
  handlePageDown: () => void;
}

class ResultPagination extends React.Component<Props, object> {
  render() {
    return (
      <div className={`w-100`}>
        {/* Results Pagination Text */}
        {this.props.totalResults > 0 ? (
          <div className={`fr pa3 dt`}>
            <div className={`tr f6 gray dtc v-mid`}>
              {`Showing results ${this.props.startIndex + 1} - ${
                this.props.endIndex
              }`}
            </div>
            <Chevron
              right={false}
              isActive={this.props.isActivePageDown}
              onClick={this.props.handlePageDown}
            />
            <Chevron
              right={true}
              isActive={this.props.isActivePageUp}
              onClick={this.props.handlePageUp}
            />
          </div>
        ) : (
          <div className={`fr pa3 dt`}>
            <div className={`tr f6 gray dtc v-mid`}>No results</div>
          </div>
        )}
      </div>
    );
  }
}

export default ResultPagination;
