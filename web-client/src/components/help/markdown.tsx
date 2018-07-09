// React
import * as React from "react";

// Components

// Types
interface Props {}

interface State {}

// Class
class Markdown extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    return (
      <div
        className={`pa2 flex flex-wrap gray`}
        style={{
          fontSize: "10px",
          userSelect: "none"
        }}
      >
        <div className={`pa2`}>## Header</div>
        <div className={`pa2`}>1. numbered</div>
        <div className={`pa2`}>- bullets</div>
        <div className={`pa2 b`}>**bold**</div>
        <div className={`pa2 i`}>_italics_</div>
        <div className={`pa2 code`}>`code`</div>
        <div className={`pa2`}>>"quote"</div>
        <div className={`pa2 `}>#tag</div>
      </div>
    );
  }
}

// Export
export default Markdown;
