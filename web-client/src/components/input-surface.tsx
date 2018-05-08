// React
import * as React from "react";

// Components
import InputText from "./input-text";

interface Props {
  handleSurface: (text: string) => void;
}

const InputSurface = (props: Props) => {
  return (
    <div className={`dt w-100`}>
      <div className={`dt-row`}>
        <InputText
          placeholder={`Search your tangle...`}
          handleEnterKey={props.handleSurface}
          allowToolbar={false}
        />
      </div>
    </div>
  );
};

export default InputSurface;
