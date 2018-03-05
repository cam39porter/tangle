import * as React from "react";

import { Link } from "react-router-dom";

export interface Props {
  title: string;
}

function NavigationBarTab(props: Props) {
  return (
    <div className={`w-25 h1 tc dib pointer`}>
      <Link to={`/${props.title}`}>{props.title}</Link>
    </div>
  );
}

export default NavigationBarTab;
