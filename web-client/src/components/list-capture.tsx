// React
import * as React from "react";

// Router

// Components
import ButtonExpand from "./button-expand";
import ButtonMore from "./button-more";
import ButtonFocus from "./button-focus";
import ButtonArchive from "./button-archive";
import ButtonEdit from "./button-edit";
import ButtonCheck from "./button-check";
import ButtonRelated from "./button-related";
import ButtonFavorite from "./button-favorite";
import InputCapture from "./input-capture";
import ListComment from "./list-comment";
import ReactTooltip from "react-tooltip";

// Utils

// Types
import {
  AnnotationFieldsFragment,
  ListFieldsFragment
} from "../__generated__/types";

interface Props {
  text: string;
  handleExpand: () => void;
  handleMore: () => void;
  isMore: boolean;
  handleComment: (text: string) => void;
  comments?: Array<ListFieldsFragment>;
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

function annotate(
  text: string,
  annotations: Array<AnnotationFieldsFragment>
): string {
  let annotatedText = "";

  for (let i = 0; i < text.length; i++) {
    let starts = annotations.filter(a => a.start === i);
    let ends = annotations.filter(a => a.end === i);
    let nextCharacter = text.charAt(i);
    let nextAnnotations = "";

    ends.forEach(a => {
      nextAnnotations = nextAnnotations + "</span>";
    });
    starts.forEach(a => {
      nextAnnotations =
        nextAnnotations +
        `<span class="${a.linkToId ? "pointer accent" : "accent"}" ${
          a.linkToId ? `id="${a.linkToId}:${a.start}:${a.end}"` : ""
        }>`;
    });

    annotatedText = annotatedText + nextAnnotations + nextCharacter;
  }

  return annotatedText;
}

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
          `${a.linkToId}:${a.start}:${a.end}`
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
          className={`flex flex-wrap pa3 pb0 w-100 br4 ba ${
            this.props.isGraphFocus ? "b--accent" : "b--light-gray"
          } bg-white`}
        >
          <div className={`w2`}>
            {this.state.isShowingButtons && (
              <div className={`flex-column`}>
                <div className={`flex-grow w-100`}>
                  <div data-tip={`Favorite this capture`}>
                    <ButtonFavorite
                      onClick={() => {
                        // TODO: add favoriting captures
                      }}
                    />
                  </div>
                </div>
                <ReactTooltip />
              </div>
            )}
          </div>
          <div className={`flex-grow pa2`}>
            {this.props.isEditing ? (
              <InputCapture
                handleTextChange={text => {
                  this.text = text;
                }}
                handleCapture={() => {
                  this.props.handleEdit(this.text);
                }}
                startingText={this.props.text}
                clearOnEnter={this.props.clearOnEnter ? true : false}
              />
            ) : (
              <div
                onDoubleClick={() => {
                  this.props.handleEdit(this.text);
                }}
                className={`lh-copy f6`}
                dangerouslySetInnerHTML={{
                  __html: this.props.annotations
                    ? annotate(this.props.text, this.props.annotations)
                    : this.props.text
                }}
              />
            )}
          </div>
          <div className={`w2`}>
            {this.state.isShowingButtons && (
              <div className={`flex-column`}>
                <div className={`flex-grow w-100`}>
                  <div data-tip={`Focus on this capture`}>
                    <ButtonFocus onClick={this.props.handleFocus} />
                  </div>
                </div>
                <div className={`flex-grow w-100`}>
                  <div className={`dt w-100 h-100`}>
                    <div className={`dtc v-btm`}>
                      <div
                        data-tip={`${
                          this.props.isMore ? "Hide" : "Show"
                        } all actions and comments`}
                      >
                        <ButtonMore
                          isMore={!this.props.isMore}
                          onClick={this.props.handleMore}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <ReactTooltip />
              </div>
            )}
          </div>
          {this.props.isMore && (
            <div className={`w-100`}>
              {/* Action Buttons */}
              <div className={`flex pa2 w-100`}>
                <div className={`flex-grow`}>
                  {this.props.isEditing ? (
                    <div data-tip={`Save your changes`}>
                      <ButtonCheck
                        onClick={() => {
                          this.props.handleEdit(this.text);
                        }}
                      />
                    </div>
                  ) : (
                    <div data-tip={`Edit this capture`}>
                      <ButtonEdit
                        onClick={() => {
                          this.props.handleEdit(this.text);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className={`flex-grow`}>
                  <div data-tip={`Delete this capture`}>
                    <ButtonArchive onClick={this.props.handleArchive} />
                  </div>
                </div>
                <div className={`flex-grow`}>
                  <div
                    data-tip={`Enter a brainstorm starting with this capture`}
                  >
                    <ButtonExpand onClick={this.props.handleExpand} />
                  </div>
                </div>
                <ReactTooltip />
              </div>
              {/* Comments */}
              <ListComment
                handleComment={this.props.handleComment}
                comments={this.props.comments}
              />
            </div>
          )}
          {this.props.handleIsShowingRelated ? (
            <div className={`w-100`}>
              <div
                className={`center pa2 w2`}
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
          ) : (
            // this adds padding to the bottom of the card when the show related button is not rendered
            <div className={`w-100 pb3`} />
          )}
        </div>
        <ReactTooltip />
      </div>
    );
  }
}

export default ListCapture;
