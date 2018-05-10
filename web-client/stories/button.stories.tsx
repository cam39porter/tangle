import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, select, text, boolean } from "@storybook/addon-knobs/react";

import Button from "../src/components/button";
import ButtonExpand from "../src/components/button-expand";
import ButtonCapture from "../src/components/button-capture";
import ButtonSurface from "../src/components/button-surface";
import ButtonExit from "../src/components/button-exit";
import ButtonToggle from "../src/components/button-toggle";
import ButtonMore from "../src/components/button-more";
import ButtonComment from "../src/components/button-comment";
import ButtonEdit from "../src/components/button-edit";
import ButtonArchive from "../src/components/button-archive";
import ButtonFocus from "../src/components/button-focus";
import ButtonRelated from "../src/components/button-related";

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

stories.add("archive", () => <ButtonArchive onClick={action("clicked")} />);
stories.add("capture", () => <ButtonCapture onClick={action("clicked")} />);
stories.add("clear", () => <ButtonExit onClick={action("clicked")} />);
stories.add("comment", () => <ButtonComment onClick={action("clicked")} />);
stories.add("edit", () => <ButtonEdit onClick={action("clicked")} />);
stories.add("expand", () => <ButtonExpand onClick={action("clicked")} />);
stories.add("focus", () => <ButtonFocus onClick={action("clicked")} />);
stories.add("more", () => (
  <ButtonMore onClick={action("clicked")} isMore={boolean("isMore", true)} />
));
stories.add("related", () => (
  <ButtonRelated onClick={action("clicked")} isUp={boolean("isUp", true)} />
));
stories.add("surface", () => <ButtonSurface onClick={action("clicked")} />);
stories.add("toggle", () => (
  <ButtonToggle
    onClick={action("clicked")}
    isRight={boolean("isRight", true)}
  />
));
