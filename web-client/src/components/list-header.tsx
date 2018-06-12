// React
import * as React from "react";

// Components
import InputCapture from "./input-capture";
import InputSurface from "./input-surface";
import ButtonToggle from "./button-toggle";
// import ButtonCapture from "./button-capture";
// import ButtonSurface from "./button-surface";
import ButtonZap from "./button-zap";
import ButtonExit from "./button-exit";
import ReactTooltip from "react-tooltip";

interface Props {
  handleCapture: (text: string) => void;
  handleExpand: () => void;
  isCapturing: boolean;
  handleIsCapturing: () => void;
  handleSurface: (text: string) => void;
  surfaceStartingText?: string;
  handleClear: () => void;
}

const ListHeader = (props: Props) => {
  return (
    <div className={`flex ph2 br4 bg-white`}>
      {/* <div className={`flex-column justify-center`}>
        {props.isCapturing ?  (
          <div data-tip={`Add this to your tangle`}>
            <ButtonCapture onClick={props.handleCapture} />
          </div> :
          <div data-tip={`Search your tangle`}>
            <ButtonSurface onClick={props.handleSurface} />
          </div>
        )}
      </div> */}
      <div className={`flex-grow pa3`}>
        {props.isCapturing ? (
          <InputCapture handleCapture={props.handleCapture} />
        ) : (
          <InputSurface
            handleSurface={props.handleSurface}
            startingHTML={props.surfaceStartingText}
          />
        )}
      </div>
      <div className={`flex-column justify-center`}>
        {props.isCapturing ? (
          <div data-tip={`Start a brainstorm`}>
            <ButtonZap onClick={props.handleExpand} />
          </div>
        ) : (
          <div data-tip={`Exit search`}>
            <ButtonExit onClick={props.handleClear} />
          </div>
        )}
      </div>
      <div className={`flex-column justify-center`}>
        <div data-tip={`Toggle to ${props.isCapturing ? "search" : "capture"}`}>
          <ButtonToggle
            isRight={props.isCapturing}
            onClick={props.handleIsCapturing}
          />
        </div>
        <ReactTooltip />
      </div>
    </div>
  );
};

export default ListHeader;
