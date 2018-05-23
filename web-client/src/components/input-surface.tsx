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
  startingText?: string;
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
          startingText={props.startingText}
          clearOnEnter={false}
        />
      </div>
      <div className={`pa1`}>
        {props.handleClear && (
          <div>
            <div data-tip={"Exit your search"}>
              <ButtonExit onClick={props.handleClear} />
            </div>
            <ReactTooltip />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSurface;
