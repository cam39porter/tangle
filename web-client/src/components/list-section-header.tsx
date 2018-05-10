// React
import * as React from "react";

interface Props {
  title: string;
}

const ListSectionHeader = (props: Props) => {
  return <div className={`pa2 w-100 ttu gray`}>{props.title}</div>;
};

export default ListSectionHeader;
