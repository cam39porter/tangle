import * as React from "react";

import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs/react";

import MenuBar from "../src/components/menu-bar";

const stories = storiesOf("Menu", module);

stories.addDecorator(withKnobs);

stories.add("bar", () => <MenuBar />);
