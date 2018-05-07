import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Button from "../src/components/button";

storiesOf("Button", module).add("in accent color", () => (
  <Button title={"button"} onClick={action("clicked")} accentColor={"accent"} />
));
