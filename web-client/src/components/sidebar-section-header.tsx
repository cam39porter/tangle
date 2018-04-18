// React
import * as React from "react";

interface Props {
  title: string;
}

const SidebarSectionHeader = function(props: Props) {
  return (
    <div className={`dt`}>
      <div className={`dtc v-btm h3 ttu f6 pa2 gray`}>{props.title}</div>
    </div>
  );
};

export default SidebarSectionHeader;
