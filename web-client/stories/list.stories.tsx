import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean, select } from "@storybook/addon-knobs/react";

import { listData } from "./data";
import ListCaptureHeader from "../src/components/list-capture-header";
import ListSessionTitle from "../src/components/list-session-title";
import ListSessionHeader from "../src/components/list-session-header";
import ListCapture from "../src/components/list-capture";
import List from "../src/components/list";

const stories = storiesOf("List", module);

stories.addDecorator(withKnobs);

stories.add("capture header", () => (
  <ListCaptureHeader handleCapture={action("handleCapture")} />
));

stories.add("session title", () => (
  <div>
    <ListSessionTitle handleEdit={action("handleChange")} />
    <ListSessionTitle
      handleEdit={action("handleChange")}
      startingTitle={`This is an example title`}
    />
  </div>
));

stories.add("session header", () => (
  <div>
    <ListSessionHeader
      startingTitle={"This is a title"}
      handleEditTitle={action("handleEditTitle")}
      handleClose={action("handleClose")}
    />
  </div>
));

stories.add("capture", () => (
  <ListCapture
    captureId={"id"}
    handleExpand={action("handleExpand")}
    startingText={select(
      "text",
      {
        "This is a short capture.": "short",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.":
          "long"
      },
      "This is a basic capture"
    )}
    handleFocus={action("handleFocus")}
    handleEdit={action("handleEdit")}
    handleArchive={action("handleArchive")}
    isGraphFocus={boolean("isGraphFocus", false)}
  />
));

stories.add("list", () => (
  <List
    // List
    listData={listData}
    handleExpand={(id: string) => action(`handleExpand ${id}`)}
    handleIsShowingRelated={(id: string) =>
      action(`handleIsShowingRelated ${id}`)
    }
    isShowingRelated={(id: string) => boolean(`isShowingRelated ${id}`, false)}
    handleFocus={(id: string) => action(`handleFocus ${id}`)}
    handleEdit={(id: string) => action(`handleEdit ${id}`)}
    handleArchive={(id: string) => action(`handleArchive ${id}`)}
    handleDismissCaptureRelation={(fromId, toId) =>
      action(`handleDismissCaptureRelation`)
    }
  />
));

stories.add("session", () => (
  <List
    // List
    listData={listData}
    handleExpand={(id: string) => action(`handleExpand ${id}`)}
    handleIsShowingRelated={(id: string) =>
      action(`handleIsShowingRelated ${id}`)
    }
    isShowingRelated={(id: string) => boolean(`isShowingRelated ${id}`, false)}
    handleFocus={(id: string) => action(`handleFocus ${id}`)}
    handleEdit={(id: string) => action(`handleEdit ${id}`)}
    handleArchive={(id: string) => action(`handleArchive ${id}`)}
    handleDismissCaptureRelation={(fromId, toId) =>
      action(`handleDismissCaptureRelation`)
    }
  />
));
