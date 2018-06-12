import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs/react";

import InputCapture from "../src/components/input-capture";
import InputSurface from "../src/components/input-surface";

const stories = storiesOf("Input", module);

stories.addDecorator(withKnobs);

stories.add("capture", () => (
  <div
    className={`pa4`}
    style={{
      width: "32.5em"
    }}
  >
    <InputCapture handleCapture={action("captured")} />
  </div>
));

stories.add("surface", () => (
  <div
    className={`pa4`}
    style={{
      width: "32.5em"
    }}
  >
    <InputSurface handleSurface={action("surfaced")} />
  </div>
));
