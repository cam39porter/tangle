import * as React from "react";

export interface Props {
  title: string;
}

function NavigationBarTab(props: Props) {
  return <p className={`w-25 h1 tc dib pointer`}>{props.title}</p>;
}

export default NavigationBarTab;
