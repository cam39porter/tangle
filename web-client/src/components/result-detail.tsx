import * as React from "react";

interface Props {
  id: string;
  body: string;
}

class ResultDetail extends React.Component<Props, object> {
  render() {
    return <div className={`tc`}>{this.props.body}</div>;
  }
}

export default ResultDetail;
