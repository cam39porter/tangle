// import * as React from "react";

import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs/react";

const stories = storiesOf("Menu", module);

stories.addDecorator(withKnobs);
