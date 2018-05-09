// React
import * as React from "react";

// Components
import ListHeader from "./list-header";
import ListCapture from "./list-capture";

// Utils

// Types
interface Node {
  id: string;
  type: string;
  text: string;
  level: number;
}

interface Edge {
  source: string;
  destination: string;
  type: string;
  salience: number | null;
}

interface Props {
  // Header Props
  handleHeaderCaptureTextChange: (text: string) => void;
  handleHeaderCapture: () => void;
  handleExpand: () => void;
  isHeaderCapturing: boolean;
  handleHeaderIsCapturing: () => void;
  handleSurfaceTextChange: (text: string) => void;
  handleSurface: () => void;
  handleSurfaceClear: () => void;
  // List
  isHidden: boolean;
  nodes: Array<Node>;
  edges: Array<Edge>;
  // Captures
  handleMore: (id: string) => (() => void);
  isMore: (id: string) => boolean;
  handleComment: (id: string) => (() => void);
  handleFocus: (id: string) => (() => void);
  handleEdit: (id: string) => (() => void);
  isEditing: (id: string) => boolean;
  handleArchive: (id: string) => (() => void);
  handleTextChange: (id: string) => ((text: string) => void);
  handleCapture: (id: string) => (() => void);
}

interface State {}

class List extends React.Component<Props, State> {
  render() {
    if (this.props.isHidden) {
      return (
        <div className={`pa4`}>
          <ListHeader
            handleCaptureTextChange={this.props.handleHeaderCaptureTextChange}
            handleCapture={this.props.handleHeaderCapture}
            handleExpand={this.props.handleExpand}
            isCapturing={this.props.isHeaderCapturing}
            handleIsCapturing={this.props.handleHeaderIsCapturing}
            handleSurfaceTextChange={this.props.handleSurfaceTextChange}
            handleSurface={this.props.handleSurface}
            handleClear={this.props.handleSurfaceClear}
          />
        </div>
      );
    }

    return (
      <div className={`relative w-100 vh-100`}>
        {/* This is the list header that is actually seen when the list is not hidden */}
        <div className={`z-max absolute top-0 left-0 pa4 w-100 bg-light-gray`}>
          <ListHeader
            handleCaptureTextChange={this.props.handleHeaderCaptureTextChange}
            handleCapture={this.props.handleHeaderCapture}
            handleExpand={this.props.handleExpand}
            isCapturing={this.props.isHeaderCapturing}
            handleIsCapturing={this.props.handleHeaderIsCapturing}
            handleSurfaceTextChange={this.props.handleSurfaceTextChange}
            handleSurface={this.props.handleSurface}
            handleClear={this.props.handleSurfaceClear}
          />
        </div>

        <div
          className={`flex flex-column overflow-auto w-100 vh-100 bg-light-gray`}
        >
          {/* This is a hack to make scrolling with fixed header work. This serves as padding. The padding needs to be the same height as the fixed bar or else it will  */}
          <div className={`pa4`}>
            <ListHeader
              handleCaptureTextChange={this.props.handleHeaderCaptureTextChange}
              handleCapture={this.props.handleHeaderCapture}
              handleExpand={this.props.handleExpand}
              isCapturing={this.props.isHeaderCapturing}
              handleIsCapturing={this.props.handleHeaderIsCapturing}
              handleSurfaceTextChange={this.props.handleSurfaceTextChange}
              handleSurface={this.props.handleSurface}
              handleClear={this.props.handleSurfaceClear}
            />
          </div>
          {this.props.nodes
            .filter(node => {
              return node.type === "Capture";
            })
            .map(capture => (
              <ListCapture
                key={capture.id}
                text={capture.text}
                handleExpand={this.props.handleExpand}
                handleMore={this.props.handleMore(capture.id)}
                isMore={this.props.isMore(capture.id)}
                handleComment={this.props.handleComment(capture.id)}
                handleFocus={this.props.handleFocus(capture.id)}
                handleEdit={this.props.handleEdit(capture.id)}
                isEditing={this.props.isEditing(capture.id)}
                handleArchive={this.props.handleArchive(capture.id)}
                handleTextChange={this.props.handleTextChange(capture.id)}
                handleCapture={this.props.handleCapture(capture.id)}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default List;
