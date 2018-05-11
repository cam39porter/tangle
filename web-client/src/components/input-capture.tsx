// React
import * as React from "react";

// Components
import InputText from "./input-text";
import ButtonExpand from "./button-expand";
import ButtonCapture from "./button-capture";
import ReactTooltip from "react-tooltip";

interface Props {
  handleTextChange: (text: string) => void;
  handleCapture: () => void;
  handleExpand?: () => void;
  startingText?: string;
  clearOnEnter: boolean;
  allowToolbar?: boolean;
}

const InputCapture = (props: Props) => {
  return (
    <div className={`flex w-100`}>
      <div className={`pa1`} data-tip={"add to your tangle"}>
        <ButtonCapture onClick={props.handleCapture} />
      </div>
      <div className={`flex-grow`}>
        <InputText
          placeholder={`Capture a thought...`}
          handleEnterKey={props.handleCapture}
          allowToolbar={props.allowToolbar}
          handleChange={props.handleTextChange}
        />
      </div>
      <div className={`pa1`} data-tip={"enter a brainstorm"}>
        {props.handleExpand && <ButtonExpand onClick={props.handleExpand} />}
      </div>
      <ReactTooltip />
    </div>
  );
};

export default InputCapture;
