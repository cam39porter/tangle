import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean, select } from "@storybook/addon-knobs/react";

import ListHeader from "../src/components/list-header";
import ListCapture from "../src/components/list-capture";

const stories = storiesOf("List", module);

stories.addDecorator(withKnobs);

stories.add("header", () => (
  <ListHeader
    handleCaptureTextChange={action("handleCaptureTextChange")}
    handleCapture={action("handleCapture")}
    handleExpand={action("handleExpand")}
    isCapturing={boolean("isCapturing", true)}
    handleIsCapturing={action("handleIsCapture")}
    handleSurfaceTextChange={action("handleSurfaceTextChange")}
    handleSurface={action("handleSurface")}
    handleClear={action("handleClear")}
  />
));

stories.add("item", () => (
  <ListCapture text={select("text", { "This is a short capture.": "short", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.": "long" }, "listcapture")} />
));
