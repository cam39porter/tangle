import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs/react";

import InputText from "../src/components/input-text";
import InputCapture from "../src/components/input-capture";
import InputSurface from "../src/components/input-surface";
import InputComment from "../src/components/input-comment";

const stories = storiesOf("Input", module);

stories.addDecorator(withKnobs);

stories.add("text", () => <InputText />);

stories.add("capture", () => (
  <InputCapture
    handleCapture={action("captured")}
    handleExpand={action("expanded")}
    handleTextChange={action("text changed")}
    clearOnEnter={boolean("clearOnEnter", true)}
  />
));

stories.add("comment", () => (
  <InputComment
    handleComment={action("surfaced")}
    handleTextChange={action("text changed")}
  />
));

stories.add("surface", () => (
  <InputSurface
    handleSurface={action("surfaced")}
    handleClear={action("clear")}
    handleTextChange={action("text changed")}
  />
));
