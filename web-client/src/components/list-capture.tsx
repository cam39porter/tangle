// React
import * as React from "react";

// Components
import ButtonExpand from "./button-expand";
import ButtonMore from "./button-more";
import ButtonFocus from "./button-focus";
import ButtonArchive from "./button-archive";
import ButtonEdit from "./button-edit";
import ButtonCheck from "./button-check";
import ButtonComment from "./button-comment";
import ButtonRelated from "./button-related";
import InputCapture from "./input-capture";
import ReactTooltip from "react-tooltip";

// Types
import { AnnotationFieldsFragment } from "../__generated__/types";

interface Props {
  text: string;
  handleExpand: () => void;
  handleMore: () => void;
  isMore: boolean;
  handleComment: () => void;
  handleFocus: () => void;
  handleEdit: (text: string) => void;
  isEditing: boolean;
  handleArchive: () => void;
  handleIsShowingRelated?: () => void;
  isShowingRelated?: boolean;
  annotations?: Array<AnnotationFieldsFragment>;
  clearOnEnter?: boolean;
}

interface State {}

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
      nextAnnotations = nextAnnotations + `</span>`;
    });
    starts.forEach(a => {
      nextAnnotations = nextAnnotations + `<span class="accent">`;
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
  }

  componentWillReceiveProps(nextProps: Props) {
    this.text = nextProps.text;
  }

  render() {
    return (
      <div>
        <div
          className={`flex flex-wrap pa3 pb0 w-100 br4 ba b--light-gray bg-white`}
        >
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
                className={`lh-copy`}
                dangerouslySetInnerHTML={{
                  __html: this.props.annotations
                    ? annotate(this.props.text, this.props.annotations)
                    : this.props.text
                }}
              />
            )}
          </div>
          <div className={`flex flex-column pa2`}>
            <div className={`flex-grow w-100 `}>
              <div data-tip={`focus on this capture`}>
                <ButtonFocus onClick={this.props.handleFocus} />
              </div>
            </div>
            <div className={`flex-grow w-100`}>
              <div className={`dt w-100 h-100`}>
                <div className={`dtc v-btm`}>
                  <div
                    data-tip={`${
                      this.props.isMore ? "hide" : "show"
                    } all actions`}
                  >
                    <ButtonMore
                      isMore={!this.props.isMore}
                      onClick={this.props.handleMore}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.props.isMore && (
            <div className={`flex pa2 w-100`}>
              <div className={`flex-grow`}>
                <div data-tip={`comment on this capture`}>
                  <ButtonComment onClick={this.props.handleComment} />
                </div>
              </div>
              <div className={`flex-grow`}>
                <div data-tip={`enter a brainstorm`}>
                  <ButtonExpand onClick={this.props.handleExpand} />
                </div>
              </div>
              <div className={`flex-grow`}>
                {this.props.isEditing ? (
                  <div data-tip={`save your changes`}>
                    <ButtonCheck
                      onClick={() => {
                        this.props.handleEdit(this.text);
                      }}
                    />
                  </div>
                ) : (
                  <div data-tip={`edit this capture`}>
                    <ButtonEdit
                      onClick={() => {
                        this.props.handleEdit(this.text);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className={`flex-grow`}>
                <div data-tip={`delete this capture`}>
                  <ButtonArchive onClick={this.props.handleArchive} />
                </div>
              </div>
              <ReactTooltip />
            </div>
          )}
          {this.props.handleIsShowingRelated ? (
            <div className={`w-100`}>
              <div
                className={`center pa2 w2`}
                data-tip={`${
                  this.props.isShowingRelated ? "hide" : "show"
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
