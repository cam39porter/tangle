import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean, select } from "@storybook/addon-knobs/react";

import { listData } from "./data";
import ListCaptureHeader from "../src/components/list-capture-header";
import ListSessionTitle from "../src/components/list-session-title";
import ListSessionHeader from "../src/components/list-session-header";
import CardCapture from "../src/components/card-capture";
import ListCaptures from "../src/components/list-captures";
import GridCaptures from "../src/components/grid-captures";
import CardSession from "../src/components/card-session";
import ListSessions from "../src/components/list-sessions";

const stories = storiesOf("List", module);

stories.addDecorator(withKnobs);

stories.add("capture header", () => (
  <div className={`measure`}>
    <ListCaptureHeader handleCapture={action("handleCapture")} />
  </div>
));

stories.add("session title", () => (
  <div className={`measure`}>
    <ListSessionTitle handleEdit={action("handleChange")} />
    <ListSessionTitle
      handleEdit={action("handleChange")}
      startingTitle={`This is an example title`}
    />
  </div>
));

stories.add("session header", () => (
  <div className={`measure`}>
    <ListSessionHeader
      startingTitle={"This is a title"}
      handleEditTitle={action("handleEditTitle")}
      handleClose={action("handleClose")}
    />
  </div>
));

stories.add("session card", () => (
  <div className={`ma4 measure`}>
    <CardSession
      title={"This is a title"}
      created={"Last Thursday"}
      handleOpen={action("handleOpen")}
      handleArchive={action("handleArchive")}
    />
  </div>
));

stories.add("capture card", () => (
  <div className={`ma4 measure`}>
    <CardCapture
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
  </div>
));

stories.add("captures list", () => (
  <div className={`ma4 pa4 measure bg-light-gray overflow-auto vh-100`}>
    <ListCaptures
      // List
      listData={listData}
      handleExpand={(id: string) => action(`handleExpand ${id}`)}
      handleIsShowingRelated={(id: string) =>
        action(`handleIsShowingRelated ${id}`)
      }
      isShowingRelated={(id: string) =>
        boolean(`isShowingRelated ${id}`, false)
      }
      handleFocus={(id: string) => action(`handleFocus ${id}`)}
      handleEdit={(id: string) => action(`handleEdit ${id}`)}
      handleArchive={(id: string) => action(`handleArchive ${id}`)}
      handleDismissCaptureRelation={(fromId, toId) =>
        action(`handleDismissCaptureRelation`)
      }
    />
  </div>
));

stories.add("captures grid", () => (
  <div className={``}>
    <div className={`bg-near-white vh-100 overflow-auto`}>
      <GridCaptures
        // List
        listData={listData}
        handleExpand={(id: string) => action(`handleExpand ${id}`)}
        handleIsShowingRelated={(id: string) =>
          action(`handleIsShowingRelated ${id}`)
        }
        isShowingRelated={(id: string) =>
          boolean(`isShowingRelated ${id}`, false)
        }
        handleFocus={(id: string) => action(`handleFocus ${id}`)}
        handleEdit={(id: string) => action(`handleEdit ${id}`)}
        handleArchive={(id: string) => action(`handleArchive ${id}`)}
        handleDismissCaptureRelation={(fromId, toId) =>
          action(`handleDismissCaptureRelation`)
        }
      />
    </div>
  </div>
));

stories.add("sessions list", () => (
  <div className={`ma4 measure avenir`}>
    <ListSessions
      // List
      listData={[
        { title: "This is a test title", created: "Last thursday", id: "1" },
        { title: "This is a test title", created: "Last thursday", id: "2" },
        { title: "This is a test title", created: "Last thursday", id: "3" },
        { title: "This is a test title", created: "Last thursday", id: "4" },
        { title: "This is a test title", created: "Last thursday", id: "5" },
        { title: "This is a test title", created: "Last thursday", id: "6" },
        { title: "This is a test title", created: "Last thursday", id: "7" }
      ]}
      handleOpen={(id: string) => action(`handleExpand ${id}`)}
      handleArchive={(id: string) => action(`handleArchive ${id}`)}
    />
  </div>
));
