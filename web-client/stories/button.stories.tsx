import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, select, text, boolean } from "@storybook/addon-knobs/react";

import Button from "../src/components/button";
import ButtonZap from "../src/components/button-zap";
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
import ButtonCheck from "../src/components/button-check";
import ButtonZapOff from "../src/components/button-zap-off";
import ButtonSettings from "../src/components/button-settings";
import ButtonImport from "../src/components/button-import";
import ButtonSurprise from "../src/components/button-surprise";
import ButtonFavorite from "../src/components/button-favorite";

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
stories.add("check", () => <ButtonCheck onClick={action("clicked")} />);
stories.add("capture", () => <ButtonCapture onClick={action("clicked")} />);
stories.add("clear", () => <ButtonExit onClick={action("clicked")} />);
stories.add("comment", () => <ButtonComment onClick={action("clicked")} />);
stories.add("contract", () => <ButtonZapOff onClick={action("clicked")} />);
stories.add("edit", () => <ButtonEdit onClick={action("clicked")} />);
stories.add("expand", () => <ButtonZap onClick={action("clicked")} />);
stories.add("favorite", () => <ButtonFavorite onClick={action("clicked")} />);
stories.add("focus", () => <ButtonFocus onClick={action("clicked")} />);
stories.add("import", () => <ButtonImport onClick={action("clicked")} />);
stories.add("more", () => (
  <ButtonMore onClick={action("clicked")} isMore={boolean("isMore", false)} />
));
stories.add("related", () => (
  <ButtonRelated onClick={action("clicked")} isUp={boolean("isUp", false)} />
));
stories.add("settings", () => <ButtonSettings onClick={action("clicked")} />);
stories.add("surface", () => <ButtonSurface onClick={action("clicked")} />);
stories.add("surprise", () => <ButtonSurprise onClick={action("clicked")} />);
stories.add("toggle", () => (
  <ButtonToggle
    onClick={action("clicked")}
    isRight={boolean("isRight", true)}
  />
));
