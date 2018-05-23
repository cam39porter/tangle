// React
import * as React from "react";

// Components
import ButtonSurprise from "./button-surprise";
import ReactToolTip from "react-tooltip";

interface Props {
  handleSurprise: () => void;
}

const NavigationSurprise = (props: Props) => (
  <div className={`flex pa2 br4 shadow-1 bg-white`}>
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
