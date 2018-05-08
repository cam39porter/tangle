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
}

const InputCapture = (props: Props) => {
  return (
    <div className={`w-100 flex`}>
      <div className={`pa1`} data-tip={"add to your tangle"}>
        <ButtonCapture onClick={props.handleCapture} />
      </div>
      <div className={`flex-grow`}>
        <InputText
          placeholder={`Capture a thought...`}
          handleEnterKey={props.handleCapture}
          allowToolbar={false}
          handleChange={props.handleTextChange}
        />
      </div>
      <div className={`pa1`} data-tip={"start a session"}>
        {props.handleExpand && <ButtonExpand onClick={props.handleExpand} />}
      </div>
      <ReactTooltip />
    </div>
  );
};

export default InputCapture;
