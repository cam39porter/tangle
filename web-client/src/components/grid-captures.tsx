// React
import * as React from "react";

// Components
import CardCapture from "./card-capture";
import ScrollContainer from "./scroll-container";
import ScrollContainerElement from "./scroll-container-element";
import { CaptureFieldsFragment } from "../__generated__/types";

// Utils
import windowSize from "react-window-size";

// Types

interface Props {
  captures: Array<CaptureFieldsFragment>;
  scrollToId?: string;
  sessionId?: string;
  headerHeight: number;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {}

class GridCaptures extends React.Component<Props, State> {
  _scrollContainer: ScrollContainer | null = null;

  constructor(props: Props) {
    super(props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.scrollToId) {
      this.scrollTo(nextProps.scrollToId);
    }
  }

  scrollTo = (id: string) => {
    this._scrollContainer && this._scrollContainer.scrollTo(id);
  };

  render() {
    return (
      <div className={``}>
        <ScrollContainer
          ref={scrollContainer => (this._scrollContainer = scrollContainer)}
        >
          <div
            className={`flex-column items-center ph2 pv4 overflow-auto`}
            style={{
              height: `${this.props.windowHeight - this.props.headerHeight}px`
            }}
          >
            {this.props.captures.map(capture => (
              <div
                className={`pv4`}
                style={{
                  width: "35em"
                }}
                key={capture.id}
              >
                <ScrollContainerElement name={capture.id}>
                  <CardCapture
                    captureId={capture.id}
                    startingText={capture.body}
                  />
                </ScrollContainerElement>
              </div>
            ))}
          </div>
        </ScrollContainer>
      </div>
    );
  }
}

const GridCapturesWithData = windowSize(GridCaptures);

export default GridCapturesWithData;
