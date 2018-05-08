// React
import * as React from "react";

interface Props {
  text: string;
}

const ListCapture = (props: Props) => {
  return (
    <div className={`flex w-100 pa3 br4 ba b--light-gray`}>
    {props.text}</div>
  );
};

export default ListCapture;
