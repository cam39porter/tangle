import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs/react";

import InputText from "../src/components/input-text";
import InputCapture from "../src/components/input-capture";
import InputSurface from "../src/components/input-surface";

const stories = storiesOf("Input", module);

stories.addDecorator(withKnobs);

stories.add("text", () => <InputText />);

stories.add("capture", () => (
  <InputCapture
    handleCapture={action("captured")}
    handleExpand={action("expanded")}
  />
));

stories.add("session", () => (
  <InputSurface handleSurface={action("surfaced")} />
));
