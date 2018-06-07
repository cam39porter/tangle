// React
import * as React from "react";

// Router

// Components
import ButtonZap from "./button-zap";
import ButtonArchive from "./button-archive";
import ButtonRelated from "./button-related";
import ButtonFavorite from "./button-favorite";
import InputCapture from "./input-capture";
import ReactTooltip from "react-tooltip";

// Utils

// Types
import { AnnotationFieldsFragment } from "../__generated__/types";

interface Props {
  captureId: string;
  text: string;
  handleExpand: () => void;
  handleFocus: () => void;
  handleFocusWithId?: (id: string) => () => void;
  handleEdit: (text: string) => void;
  isEditing: boolean;
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

// function annotate(
//   captureId: string,
//   text: string,
//   annotations: Array<AnnotationFieldsFragment>
// ): string {
//   let annotatedText = "";

//   for (let i = 0; i < text.length; i++) {
//     let starts = annotations.filter(a => a.start === i);
//     let ends = annotations.filter(a => a.end === i);
//     let nextCharacter = text.charAt(i);
//     let nextAnnotations = "";

//     ends.forEach(a => {
//       nextAnnotations = nextAnnotations + "</span>";
//     });
//     starts.forEach(a => {
//       nextAnnotations =
//         nextAnnotations +
//         `<span class="${a.linkToId ? "pointer accent" : "accent"}" ${
//           a.linkToId
//             ? `id="${captureId}:${a.linkToId}:${a.start}:${a.end}"`
//             : ""
//         }>`;
//     });

//     annotatedText = annotatedText + nextAnnotations + nextCharacter;
//   }

//   return annotatedText;
// }

class ListCapture extends React.Component<Props, State> {
  text: string = "";

  constructor(nextProps: Props) {
    super(nextProps);

    this.text = nextProps.text;

    this.state = {
      isShowingButtons: false
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.text = nextProps.text;
  }

  componentDidMount() {
    // add links to annotations
    this.props.annotations &&
      this.props.annotations.forEach(a => {
        if (a.linkToId === null) {
          return;
        }
        let annotationNode = document.getElementById(
          `${this.props.captureId}:${a.linkToId}:${a.start}:${a.end}`
        );
        annotationNode &&
          annotationNode.addEventListener("click", () => {
            this.props.handleFocusWithId &&
              a.linkToId &&
              this.props.handleFocusWithId(a.linkToId)();
          });
      });
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
          className={`flex flex-wrap pa3 w-100 br4 ba ${
            this.props.isGraphFocus ? "b--accent" : "b--light-gray"
          } bg-white pointer`}
          onClick={e => {
            if (e.target["id"] === `list-capture`) {
              this.props.handleFocus();
            }
          }}
        >
          <div className={`w2`}>
            {this.state.isShowingButtons && (
              <div className={`flex-column`}>
                <div className={`flex-grow w-100`}>
                  <div data-tip={`Favorite this capture`}>
                    <ButtonFavorite
                      onClick={() => {
                        // TODO: add favorite captures
                      }}
                    />
                  </div>
                </div>
                <div className={`flex-grow w-100`}>
                  {this.props.handleIsShowingRelated && (
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
                  )}
                </div>
                <ReactTooltip />
              </div>
            )}
          </div>
          <div
            className={`flex-grow dt ph2`}
            style={{
              minHeight: "5em"
            }}
          >
            <div
              className={`dtc v-mid`}
              style={{
                cursor: "text"
              }}
            >
              <InputCapture
                handleOnChange={text => {
                  this.text = text;
                }}
                handleEdit={() => {
                  this.props.handleEdit(this.text);
                }}
                startingHTML={this.props.text}
              />
            </div>
          </div>
          <div className={`w2`}>
            {this.state.isShowingButtons && (
              <div className={`flex-column`}>
                <div className={`flex-grow w-100`}>
                  <div
                    data-tip={`Enter a brainstorm starting with this capture`}
                  >
                    <ButtonZap onClick={this.props.handleExpand} />
                  </div>
                </div>
                <div className={`flex-grow w-100`}>
                  <div className={`dt w-100 h-100`}>
                    <div className={`dtc v-btm`}>
                      <div data-tip={`Delete this capture`}>
                        <ButtonArchive onClick={this.props.handleArchive} />
                      </div>
                    </div>
                  </div>
                </div>
                <ReactTooltip />
              </div>
            )}
          </div>
        </div>
        <ReactTooltip />
      </div>
    );
  }
}

export default ListCapture;
