// React
import * as React from "react";

// Components
import CardCapture from "./card-capture";
import CardSession from "./card-session";
import ScrollContainer from "./scroll-container";
import ScrollContainerElement from "./scroll-container-element";
import {
  CaptureFieldsFragment,
  SessionFieldsFragment
} from "../__generated__/types";

// Utils
import windowSize from "react-window-size";

// Types
interface Props {
  sessions: Array<SessionFieldsFragment>;
  captures: Array<CaptureFieldsFragment>;
  scrollToId?: string;
  sessionId?: string;
  headerHeight: number;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {}

const WIDTH = "30em";

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
            {/* Sessions */}
            <div>
              <div
                className={`pb4 w-100 tl ttu gray`}
                style={{
                  width: WIDTH
                }}
              >
                Brainstorms
              </div>
              {!!this.props.sessions.length && (
                <div className={`br4 bg-white`}>
                  {this.props.sessions.map(session => (
                    <div
                      className={``}
                      style={{
                        width: WIDTH
                      }}
                      key={session.id}
                    >
                      <ScrollContainerElement name={session.id}>
                        <CardSession
                          id={session.id}
                          title={session.title}
                          created={session.created}
                        />
                      </ScrollContainerElement>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Captures */}
            <div>
              <div
                className={`pt4 w-100 tl ttu gray`}
                style={{
                  width: WIDTH
                }}
              >
                Captures
              </div>
              {this.props.captures.map(capture => (
                <div
                  className={`pt4`}
                  style={{
                    width: WIDTH
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
          </div>
        </ScrollContainer>
      </div>
    );
  }
}

const GridCapturesWithData = windowSize(GridCaptures);

export default GridCapturesWithData;
