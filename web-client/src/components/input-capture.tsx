// React
import * as React from "react";

// Components
import InputText from "./input-text";
import ButtonExpand from "./button-expand";
import ButtonCapture from "./button-capture";
import ReactTooltip from "react-tooltip";

interface Props {
  handleCapture: (text: string) => void;
  handleExpand?: () => void;
}

const InputCapture = (props: Props) => {
  return (
    <div className={`w-100 flex`}>
      <div className={`w2`} data-tip={"start a session"}>
        {props.handleExpand && (
          <div className={``}>
            <ButtonExpand onClick={props.handleExpand} />
          </div>
        )}
      </div>
      <div className={``}>
        <InputText
          placeholder={`Capture a thought...`}
          handleEnterKey={props.handleCapture}
          allowToolbar={false}
        />
      </div>
      <div className={``}>
        <ButtonCapture
          onClick={() => {
            return;
          }}
        />
      </div>
      <ReactTooltip />
    </div>
  );
};

export default InputCapture;
