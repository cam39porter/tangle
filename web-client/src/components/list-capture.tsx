// React
import * as React from "react";

<<<<<<< HEAD
// Components
import ButtonExpand from "./button-expand";
import ButtonMore from "./button-more";
import ButtonFocus from "./button-focus";
import ButtonArchive from "./button-archive";
import ButtonEdit from "./button-edit";
import ButtonComment from "./button-comment";
import ButtonRelated from "./button-related";
import InputCapture from "./input-capture";
import ReactTooltip from "react-tooltip";

interface Props {
  text: string;
  handleExpand: () => void;
  handleMore: () => void;
  isMore: boolean;
  handleComment: () => void;
  handleFocus: () => void;
  handleEdit: () => void;
  isEditing: boolean;
  handleArchive: () => void;
  handleTextChange: (text: string) => void;
  handleCapture: () => void;
  handleIsShowingRelated?: () => void;
  isShowingRelated?: boolean;
  highlightTerms?: Array<string>;
}

function highlightedText(text: string, terms: Array<string>): string {
  let highlightedText = text;
  terms.forEach(term => {
    let regex = new RegExp(term, "g");
    highlightedText = highlightedText.replace(
      regex,
      `<span class="accent">${term}</span>`
    );
  });

  return highlightedText;
=======
interface Props {
  text: string;
>>>>>>> parent of 881a327... sessions;
}

const ListCapture = (props: Props) => {
  return (
<<<<<<< HEAD
    <div>
      <div
        className={`flex flex-wrap pa3 pb0 w-100 br4 ba b--light-gray bg-white`}
      >
        <div className={`flex-grow pa2`}>
          {props.isEditing ? (
            <InputCapture
              handleTextChange={props.handleTextChange}
              handleCapture={props.handleCapture}
              startingText={props.text}
              clearOnEnter={false}
            />
          ) : (
            <div
              onDoubleClick={props.handleEdit}
              className={`lh-copy`}
              dangerouslySetInnerHTML={{
                __html: props.highlightTerms
                  ? highlightedText(props.text, props.highlightTerms)
                  : props.text
              }}
            />
          )}
        </div>
        <div className={`flex flex-column pa2`}>
          <div className={`flex-grow w-100 `}>
            <div data-tip={`enter a brainstorm`}>
              <ButtonExpand onClick={props.handleExpand} />
            </div>
          </div>
          <div className={`flex-grow w-100`}>
            <div className={`dt w-100 h-100`}>
              <div className={`dtc v-btm`}>
                <div data-tip={`${props.isMore ? "hide" : "show"} all actions`}>
                  <ButtonMore
                    isMore={!props.isMore}
                    onClick={props.handleMore}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {props.isMore && (
          <div className={`flex pa2 w-100`}>
            <div className={`flex-grow`}>
              <div data-tip={`comment on this capture`}>
                <ButtonComment onClick={props.handleComment} />
              </div>
            </div>
            <div className={`flex-grow`} data-tip={`focus on this capture`}>
              <div data-tip={`focus on this capture`}>
                <ButtonFocus onClick={props.handleFocus} />
              </div>
            </div>
            <div className={`flex-grow`}>
              <div data-tip={`edit this capture`}>
                <ButtonEdit onClick={props.handleEdit} />
              </div>
            </div>
            <div className={`flex-grow`}>
              <div data-tip={`delete this capture`}>
                <ButtonArchive onClick={props.handleArchive} />
              </div>
            </div>
          </div>
        )}
        {props.handleIsShowingRelated ? (
          <div className={`w-100`}>
            <div
              className={`center pa2 w2`}
              data-tip={`${
                props.isShowingRelated ? "hide" : "show"
              } related captures`}
            >
              <ButtonRelated
                isUp={!!props.isShowingRelated}
                onClick={props.handleIsShowingRelated}
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
=======
    <div className={`flex w-100 pa3 br4 ba b--light-gray`}>
    {props.text}</div>
>>>>>>> parent of 881a327... sessions;
  );
};

export default ListCapture;
