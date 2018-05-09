// React
import * as React from "react";

// Components
import InputCapture from "./input-capture";
import InputSurface from "./input-surface";
import ButtonToggle from "./button-toggle";
import ReactTooltip from "react-tooltip";

interface Props {
  handleCaptureTextChange: (text: string) => void;
  handleCapture: () => void;
  handleExpand: () => void;
  isCapturing: boolean;
  handleIsCapturing: () => void;
  handleSurfaceTextChange: (text: string) => void;
  handleSurface: () => void;
  handleClear: () => void;
}

const ListHeader = (props: Props) => {
  return (
    <div
      className={`flex pa2 w-100 shadow-1 br4 bb b--${
        props.isCapturing ? "accent" : "base"
      } bg-white`}
    >
      <div className={`flex-grow`}>
        {props.isCapturing ? (
          <InputCapture
            handleTextChange={props.handleCaptureTextChange}
            handleCapture={props.handleCapture}
            handleExpand={props.handleExpand}
            clearOnEnter={true}
          />
        ) : (
          <InputSurface
            handleTextChange={props.handleSurfaceTextChange}
            handleSurface={props.handleSurface}
            handleClear={props.handleClear}
          />
        )}
      </div>
      <div
        className={`pa1`}
        data-tip={`toggle to ${props.isCapturing ? "search" : "capture"}`}
      >
        <ButtonToggle
          isRight={props.isCapturing}
          onClick={props.handleIsCapturing}
        />
      </div>
      <ReactTooltip />
    </div>
  );
};

export default ListHeader;
