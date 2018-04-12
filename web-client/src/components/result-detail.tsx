// React
import * as React from "react";

interface Props {
  id: string;
  body: string;
}

class ResultDetail extends React.Component<Props, object> {
  render() {
    return (
      <div
        className={`w-100 bg-blue light-gray pa3 tl f6`}
        style={{ minHeight: "8rem" }}
      >
        <div className={`measure lh-copy`}>{this.props.body}</div>
      </div>
    );
  }
}

export default ResultDetail;
