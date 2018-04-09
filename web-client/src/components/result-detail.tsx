import * as React from "react";

interface Props {
  id: string;
}

class ResultDetail extends React.Component<Props, object> {
  render() {
    return <div className={`tc`}>{this.props.id}</div>;
  }
}

export default ResultDetail;
