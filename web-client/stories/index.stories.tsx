import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

const { Welcome } = require("@storybook/react/demo");

import Button from "../src/components/button";

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("Components/Button", module).add("with text", () => (
  <Button title={"button"} onClick={action("clicked")} accentColor={"accent"} />
));
