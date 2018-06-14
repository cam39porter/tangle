// React
import * as React from "react";

// Router

// Components
import ButtonZap from "./button-zap";
import ButtonArchive from "./button-archive";
import ButtonRelated from "./button-related";
import InputCapture from "./input-capture";
import ReactTooltip from "react-tooltip";

// Utils

// Types
import { AnnotationFieldsFragment } from "../__generated__/types";

interface Props {
  captureId: string;
  startingText: string;
  handleExpand: () => void;
  handleFocus: () => void;
  handleFocusWithId?: (id: string) => () => void;
  handleEdit: (text: string) => void;
  handleArchive: () => void;
  handleIsShowingRelated?: () => void;
  isShowingRelated?: boolean;
  annotations?: Array<AnnotationFieldsFragment>;
  clearOnEnter?: boolean;
  isGraphFocus: boolean;
}

interface State {
  isShowingButtons: boolean;
}

class ListCapture extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      isShowingButtons: false
    };
  }

  render() {
    return (
      <div
        onMouseEnter={() => {
          this.setState({
            isShowingButtons: true
          });
        }}
        onMouseLeave={() => {
          this.setState({
            isShowingButtons: false
          });
        }}
      >
        <div
          id={`list-capture`}
          className={`relative flex flex-wrap pa3 w-100 br4 ba ${
            this.props.isGraphFocus || this.state.isShowingButtons
              ? "b--accent shadow-1 z-max"
              : "b--light-gray"
          } bg-white`}
        >
          <div className={`flex-grow dt`}>
            <div
              className={`dtc v-mid`}
              style={{
                cursor: "text"
              }}
            >
              <InputCapture
                handleEdit={text => {
                  this.props.handleEdit(text);
                }}
                startingHTML={this.props.startingText}
              />
            </div>
          </div>
          {this.state.isShowingButtons && (
            <div
              className={`absolute flex top--1 right-0 h2 ph2 br4 shadow-1 z-max bg-white gray`}
            >
              <div className={`w2`}>
                <div data-tip={`Enter a brainstorm starting with this capture`}>
                  <ButtonZap onClick={this.props.handleExpand} />
                </div>
              </div>
              <div className={`w2`}>
                <div data-tip={`Delete this capture`}>
                  <ButtonArchive onClick={this.props.handleArchive} />
                </div>
              </div>
              {this.props.handleIsShowingRelated && (
                <div className={`w2 accent`}>
                  <div
                    data-tip={`${
                      this.props.isShowingRelated ? "Hide" : "Show"
                    } related captures`}
                  >
                    <ButtonRelated
                      isUp={!!this.props.isShowingRelated}
                      onClick={this.props.handleIsShowingRelated}
                    />
                  </div>
                </div>
              )}
              <ReactTooltip />
            </div>
          )}
        </div>
        <ReactTooltip />
      </div>
    );
  }
}

export default ListCapture;
