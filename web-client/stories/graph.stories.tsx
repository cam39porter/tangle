import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs/react";

import { nodes, edges } from "./data";
import GraphVisualization from "../src/components/graph-visualization";

const stories = storiesOf("Graph", module);

stories.addDecorator(withKnobs);

stories.add("visualization", () => (
  <div className={`w-100 vh-100 bg-near-white`}>
    <GraphVisualization
      refEChart={action("refEChart")}
      nodes={nodes}
      edges={edges}
      onClick={action("onClick")}
      onMouseOver={action("onMouseOver")}
      onMouseOut={action("onMouseOut")}
      showTooltip={false}
    />
  </div>
));
