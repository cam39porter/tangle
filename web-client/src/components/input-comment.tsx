// React
import * as React from "react";

// Components
import InputText from "./input-text";
import ButtonComment from "./button-comment";
import ReactTooltip from "react-tooltip";

// Types

interface Props {
  handleTextChange: (text: string) => void;
  handleComment: () => void;
}

const InputComment = (props: Props) => {
  return (
    <div className={`flex pa2 w-100`}>
      <div className={`pv1 pr1`} data-tip={`comment on this capture`}>
        <ButtonComment onClick={props.handleComment} />
      </div>
      <div className={`flex-grow`}>
        <InputText
          placeholder={`Enter a comment`}
          handleChange={props.handleTextChange}
          handleEnterKey={props.handleComment}
          clearOnEnter={true}
        />
      </div>
      <ReactTooltip />
    </div>
  );
};

export default InputComment;
