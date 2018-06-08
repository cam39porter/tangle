import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs/react";

import InputCapture from "../src/components/input-capture";
import InputSurface from "../src/components/input-surface";

const stories = storiesOf("Input", module);

stories.addDecorator(withKnobs);

stories.add("capture", () => (
  <InputCapture
    handleCapture={action("captured")}
    handleOnChange={action("text changed")}
  />
));

stories.add("surface", () => (
  <InputSurface
    handleSurface={action("surfaced")}
    handleOnChange={action("text changed")}
  />
));
