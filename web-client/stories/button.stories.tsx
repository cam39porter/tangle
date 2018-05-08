import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, select, text } from "@storybook/addon-knobs/react";

import Button from "../src/components/button";
import ButtonExpand from "../src/components/button-expand";
import ButtonCapture from "../src/components/button-capture";
import ButtonSurface from "../src/components/button-surface";

const stories = storiesOf("Button", module);

stories.addDecorator(withKnobs);

stories.add("basic", () => (
  <Button
    title={text("title", "button")}
    onClick={action("clicked")}
    accentColor={select(
      "accentColor",
      {
        accent: "accent",
        base: "base",
        gray: "gray"
      },
      "accent"
    )}
  />
));

stories.add("expand", () => <ButtonExpand onClick={action("clicked")} />);

stories.add("capture", () => <ButtonCapture onClick={action("clicked")} />);

stories.add("surface", () => <ButtonSurface onClick={action("clicked")} />);
