// React
import * as React from "react";

interface Props {
  title: string;
}

const SidebarSectionHeader = function(props: Props) {
  return (
    <div className={`dt`}>
      <div className={`dtc v-mid h3 ttu pa3 gray`}>{props.title}</div>
    </div>
  );
};

export default SidebarSectionHeader;
