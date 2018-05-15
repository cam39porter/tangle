import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean, select } from "@storybook/addon-knobs/react";

import { listData } from "./data";
import ListHeader from "../src/components/list-header";
import ListSessionTitle from "../src/components/list-session-title";
import ListSessionTags from "../src/components/list-session-tags";
import ListSessionHeader from "../src/components/list-session-header";
import ListCapture from "../src/components/list-capture";
import List from "../src/components/list";

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

stories.add("session title", () => (
  <div>
    <ListSessionTitle
      handleEdit={action("handleEdit")}
      isEditing={boolean("isEditing", false)}
    />
    <ListSessionTitle
      handleEdit={action("handleEdit")}
      isEditing={boolean("isEditing", false)}
      title={`This is an example title`}
    />
  </div>
));

stories.add("session tags", () => (
  <div>
    <ListSessionTags
      handleEdit={action("handleEdit")}
      isEditing={boolean("isEditing", false)}
    />
    <ListSessionTags
      handleEdit={action("handleEdit")}
      isEditing={boolean("isEditing", false)}
      tags={["tag1", "tag2", "tag3"]}
    />
  </div>
));

stories.add("session header", () => (
  <div>
    <ListSessionHeader
      title={"This is a title"}
      handleEditTitle={action("handleEditTitle")}
      isEditingTitle={boolean("isEditingTitle", false)}
      handleEditTags={action("handleEditTags")}
      isEditingTags={boolean("isEditingTags", false)}
      tags={["tag1", "tag2", "tag3"]}
      handleClose={action("handleClose")}
    />
  </div>
));

stories.add("capture", () => (
  <ListCapture
    handleExpand={action("handleExpand")}
    text={select(
      "text",
      {
        "This is a short capture.": "short",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.":
          "long"
      },
      "This is a basic capture"
    )}
    handleMore={action("handleMore")}
    isMore={boolean("isMore", true)}
    handleComment={action("handleComment")}
    handleFocus={action("handleFocus")}
    handleEdit={action("handleEdit")}
    isEditing={boolean("isEditing", false)}
    handleArchive={action("handleArchive")}
    handleCapture={action("handleArchive")}
    handleTextChange={action("handleTextChange")}
  />
));

stories.add("list", () => (
  <List
    // List
    isHidden={boolean("isHidden", false)}
    handleIsHidden={action(`handleIsHidden`)}
    listData={listData}
    // Session
    sessionId={undefined}
    sessionTitle={"This is an example title"}
    sessionTags={["tag1", "tag2", "tag3"]}
    sessionIsEditingTags={boolean("sessionIsEditingTags", true)}
    sessionIsEditingTitle={boolean("sessionIsEditingTitle", false)}
    sessionHandleEditTags={action("sessionHandleEditTags")}
    sessionHandleEditTitle={action("sessionHandleEditTitle")}
    sessionHandleClose={action("sessionHandleClose")}
    // Header
    handleHeaderCaptureTextChange={action("handleCaptureTextChange")}
    handleHeaderCapture={action("handleCapture")}
    handleHeaderExpand={action("handleExpand")}
    isHeaderCapturing={boolean("isCapturing", true)}
    handleHeaderIsCapturing={action("handleIsCapture")}
    handleSurfaceTextChange={action("handleSurfaceTextChange")}
    handleSurface={action("handleSurface")}
    handleSurfaceClear={action("handleClear")}
    headerPaddingText={""}
    footerPaddingText={""}
    // Captures
    handleExpand={(id: string) => action(`handleExpand ${id}`)}
    handleIsShowingRelated={(id: string) =>
      action(`handleIsShowingRelated ${id}`)
    }
    isShowingRelated={(id: string) => boolean(`isShowingRelated ${id}`, false)}
    handleMore={(id: string) => action(`handleMore ${id}`)}
    isMore={(id: string) => boolean(`isMore ${id}`, false)}
    handleComment={(id: string) => action(`handleComment ${id}`)}
    handleFocus={(id: string) => action(`handleFocus ${id}`)}
    handleEdit={(id: string) => action(`handleEdit ${id}`)}
    isEditing={(id: string) => boolean(`isEditing ${id}`, false)}
    handleArchive={(id: string) => action(`handleArchive ${id}`)}
    handleTextChange={(id: string) => action("handleTextChange")}
    handleCapture={(id: string) => action(`handleCapture ${id}`)}
  />
));

stories.add("session", () => (
  <List
    // List
    isHidden={boolean("isHidden", false)}
    handleIsHidden={action(`handleIsHidden`)}
    listData={listData}
    // Session
    sessionId={"sessionId"}
    sessionTitle={"This is an example title"}
    sessionTags={["tag1", "tag2", "tag3"]}
    sessionIsEditingTags={boolean("sessionIsEditingTags", true)}
    sessionIsEditingTitle={boolean("sessionIsEditingTitle", false)}
    sessionHandleEditTags={action("sessionHandleEditTags")}
    sessionHandleEditTitle={action("sessionHandleEditTitle")}
    sessionHandleClose={action("sessionHandleClose")}
    // Header
    handleHeaderCaptureTextChange={action("handleCaptureTextChange")}
    handleHeaderCapture={action("handleCapture")}
    handleHeaderExpand={action("handleExpand")}
    isHeaderCapturing={boolean("isCapturing", true)}
    handleHeaderIsCapturing={action("handleIsCapture")}
    handleSurfaceTextChange={action("handleSurfaceTextChange")}
    handleSurface={action("handleSurface")}
    handleSurfaceClear={action("handleClear")}
    headerPaddingText={""}
    footerPaddingText={""}
    // Captures
    handleExpand={(id: string) => action(`handleExpand ${id}`)}
    handleIsShowingRelated={(id: string) =>
      action(`handleIsShowingRelated ${id}`)
    }
    isShowingRelated={(id: string) => boolean(`isShowingRelated ${id}`, false)}
    handleMore={(id: string) => action(`handleMore ${id}`)}
    isMore={(id: string) => boolean(`isMore ${id}`, false)}
    handleComment={(id: string) => action(`handleComment ${id}`)}
    handleFocus={(id: string) => action(`handleFocus ${id}`)}
    handleEdit={(id: string) => action(`handleEdit ${id}`)}
    isEditing={(id: string) => boolean(`isEditing ${id}`, false)}
    handleArchive={(id: string) => action(`handleArchive ${id}`)}
    handleTextChange={(id: string) => action("handleTextChange")}
    handleCapture={(id: string) => action(`handleCapture ${id}`)}
  />
));
