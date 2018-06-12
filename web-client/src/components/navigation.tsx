// React
import * as React from "react";

// Components
import ButtonHome from "./button-home";
import ButtonZap from "./button-zap";
import ButtonSurprise from "./button-surprise";
import ReactToolTip from "react-tooltip";

interface Props {
  handleHome: () => void;
  handleSurprise: () => void;
  handleSession: () => void;
}

const NavigationSurprise = (props: Props) => (
  <div className={`flex-columns pa2 br4 shadow-1 bg-white`}>
    <div
      className={`flex-grow ma2`}
      data-tip={`View your most recent captures`}
    >
      <ButtonHome onClick={props.handleHome} />
    </div>
    <div className={`flex-grow ma2`} data-tip={`Start a new brainstorm`}>
      <ButtonZap onClick={props.handleSession} />
    </div>
    <div
      className={`flex-grow ma2`}
      data-tip={`Surprise me with a random capture`}
    >
      <ButtonSurprise onClick={props.handleSurprise} />
    </div>
    <ReactToolTip />
  </div>
);

export default NavigationSurprise;
