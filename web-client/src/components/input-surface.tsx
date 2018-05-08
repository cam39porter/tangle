// React
import * as React from "react";

// Components
import InputText from "./input-text";
import ReactTooltip from "react-tooltip";
import ButtonSurface from "./button-surface";
import ButtonExit from "./button-exit";

interface Props {
  handleTextChange: (text: string) => void;
  handleSurface: () => void;
  handleClear?: () => void;
}

const InputSurface = (props: Props) => {
  return (
    <div className={`w-100 flex`}>
      <div className={`pa1`}>
        <ButtonSurface onClick={props.handleSurface} />
      </div>
      <div className={`flex-grow`}>
        <InputText
          placeholder={`Search your tangle...`}
          handleEnterKey={props.handleSurface}
          allowToolbar={false}
          handleChange={props.handleTextChange}
        />
      </div>
      <div className={`pa1`} data-tip={"exit your search"}>
        {props.handleClear && <ButtonExit onClick={props.handleClear} />}
      </div>
      <ReactTooltip />
    </div>
  );
};

export default InputSurface;
