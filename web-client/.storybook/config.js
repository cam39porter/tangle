/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from "@storybook/react";

// styles
import "../src/custom.css";
import "../src/index.css";

const req = require.context("../stories", true, /\.tsx?$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
