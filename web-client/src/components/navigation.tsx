// React
import * as React from "react";

// Components
import ButtonSurprise from "./button-surprise";
import ReactToolTip from "react-tooltip";

interface Props {
  handleSurprise: () => void;
}

const NavigationSurprise = (props: Props) => (
  <div className={`pa2 br4 shadow-1 bg-white`}>
    <div data-tip={`Surprise me with a random capture`}>
      <ButtonSurprise onClick={props.handleSurprise} />
    </div>
    <ReactToolTip />
  </div>
);

export default NavigationSurprise;
