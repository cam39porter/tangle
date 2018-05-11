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
    nodes={nodes}
    edges={edges}
    // Session
    isSession={boolean("isSession", false)}
    // Header
    handleHeaderCaptureTextChange={action("handleCaptureTextChange")}
    handleHeaderCapture={action("handleCapture")}
    handleHeaderExpand={action("handleExpand")}
    isHeaderCapturing={boolean("isCapturing", true)}
    handleHeaderIsCapturing={action("handleIsCapture")}
    handleSurfaceTextChange={action("handleSurfaceTextChange")}
    handleSurface={action("handleSurface")}
    handleSurfaceClear={action("handleClear")}
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

stories.add("session", () => <ListSession />);

let nodes = [
  {
    id: "urn:hex:capture:b3bf7f3a-849e-4d20-97d9-9b231561fade",
    type: "Capture",
    text: "Ron Conway is one of the founders of SV Angel",
    level: 0
  },
  {
    id: "urn:hex:entity:SV Angel;ORGANIZATION",
    type: "Entity",
    text: "SV Angel",
    level: 1
  },
  {
    id: "urn:hex:entity:founders;PERSON",
    type: "Entity",
    text: "founders",
    level: 1
  },
  {
    id: "urn:hex:entity:one;OTHER",
    type: "Entity",
    text: "one",
    level: 1
  },
  {
    id: "urn:hex:entity:Ron Conway;PERSON",
    type: "Entity",
    text: "Ron Conway",
    level: 1
  },
  {
    id: "urn:hex:capture:7070e7b6-2608-42fa-b2f1-7c519151d4d5",
    type: "Capture",
    text: "Andrew Choi is close with one of the founders of Product Hunt",
    level: 1
  },
  {
    id: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    type: "Capture",
    text:
      "Abram Dawson told us that Ron Conway has a system for doing what Tangle proposes to do for you. He has a folder on each person that he meets with and updates it after he meets with them again. He then reviews that folder before each meeting",
    level: 0
  },
  {
    id: "urn:hex:entity:folder;OTHER",
    type: "Entity",
    text: "folder",
    level: 1
  },
  {
    id: "urn:hex:entity:meeting;EVENT",
    type: "Entity",
    text: "meeting",
    level: 1
  },
  {
    id: "urn:hex:entity:person;PERSON",
    type: "Entity",
    text: "person",
    level: 1
  },
  {
    id: "urn:hex:entity:Tangle;OTHER",
    type: "Entity",
    text: "Tangle",
    level: 1
  },
  {
    id: "urn:hex:entity:updates;OTHER",
    type: "Entity",
    text: "updates",
    level: 1
  },
  {
    id: "urn:hex:entity:system;OTHER",
    type: "Entity",
    text: "system",
    level: 1
  },
  {
    id: "urn:hex:entity:Abram Dawson;PERSON",
    type: "Entity",
    text: "Abram Dawson",
    level: 1
  },
  {
    id: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
    type: "Capture",
    text: "David Dohan recommended using Spacy for our NLP library for Tangle",
    level: 0
  },
  {
    id: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    type: "Capture",
    text:
      "Andrew Choi though it was important that we teach people the right reflexes when using Tangle. Having a full markdown editor does not teach the right reflex, where as having a type ahead feature does as it ensures you write captures that connect to other captures.",
    level: 0
  },
  {
    id: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
    type: "Capture",
    text: "PLG Ventures also immediately saw the value of Tangle as a CRM",
    level: 0
  },
  {
    id: "urn:hex:capture:fe11ef6e-e8cf-4feb-978d-2b1a7484ae98",
    type: "Capture",
    text:
      "When we met Abram Dawson he was switching from Salesforce to a new CRM. He immediately saw the value of system focused on making connections via unstructured inputs or thoughts\n",
    level: 1
  },
  {
    id: "urn:hex:capture:b7ed02ed-1c3a-416e-b626-ecd326cc2b5b",
    type: "Capture",
    text:
      "Abram Dawson was introduced to us via Will Minshew because they play Settlers of Catan together\n",
    level: 1
  },
  {
    id: "urn:hex:capture:83b60c40-92f2-4a0c-baf4-b16a1edaabb4",
    type: "Capture",
    text:
      "Abram Dawson is going to introduce us to Ryan Hoover, the founder of Product Hunt\n",
    level: 1
  },
  {
    id: "urn:hex:capture:a2c80f3d-33de-48cb-bb17-74b258c56e5d",
    type: "Capture",
    text: "Abram Dawson was Forbes 30 Under 30 for VC\n",
    level: 1
  },
  {
    id: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    type: "Capture",
    text:
      "Abram Dawson liked that Slack used an editor that operates like a command line tool and thought that we should do the same with the Tangle input or capture #features #design",
    level: 0
  },
  {
    id: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    type: "Capture",
    text:
      "Abram Dawson had the idea that we should seed a tangle with our biographies and background as well as information about who we are meeting with so that the demo contains information that will be familiar for all parties #pitch",
    level: 0
  },
  {
    id: "urn:hex:capture:eac6c020-acf5-45f2-a1fa-3f14d4f216f8",
    type: "Capture",
    text:
      "Abram Dawson offered to introduce us to his friend Justin Mars who he described as Tim Ferris\n",
    level: 1
  },
  {
    id: "urn:hex:capture:8f4d5e72-c06e-4e21-9d0f-77e6e109466c",
    type: "Capture",
    text: "Abram Dawson is a principal at SV Angels in San Francisco",
    level: 1
  },
  {
    id: "urn:hex:entity:CRM;OTHER",
    type: "Entity",
    text: "CRM",
    level: 1
  },
  {
    id: "urn:hex:entity:value;OTHER",
    type: "Entity",
    text: "value",
    level: 1
  },
  {
    id: "urn:hex:entity:PLG Ventures;ORGANIZATION",
    type: "Entity",
    text: "PLG Ventures",
    level: 1
  },
  {
    id: "urn:hex:capture:d61a6f07-7974-4c8d-8f2c-7be05c6c9c69",
    type: "Capture",
    text:
      "Randy Brown said that doing YC is more about the longterm value. You are a part of the YC alumni network and have access to everyone as customers and advisers",
    level: 1
  },
  {
    id: "urn:hex:capture:d548566c-fd88-4080-9e81-903ef6fce887",
    type: "Capture",
    text: "PLG Ventures and Chaac Ventures share an office in LA",
    level: 1
  },
  {
    id: "urn:hex:capture:1d9e61d8-1567-45c7-960e-b52145572480",
    type: "Capture",
    text: "Patrick Goldberg is the founder of PLG Ventures",
    level: 1
  },
  {
    id: "urn:hex:capture:7653822f-b5ed-415a-853b-3b0af829f0d2",
    type: "Capture",
    text: "Elaine Russel is a partner at PLG Ventures",
    level: 1
  },
  {
    id: "urn:hex:tag:design",
    type: "Tag",
    text: "design",
    level: 1
  },
  {
    id: "urn:hex:tag:features",
    type: "Tag",
    text: "features",
    level: 1
  },
  {
    id: "urn:hex:entity:capture;OTHER",
    type: "Entity",
    text: "capture",
    level: 1
  },
  {
    id: "urn:hex:entity:Tangle input;OTHER",
    type: "Entity",
    text: "Tangle input",
    level: 1
  },
  {
    id: "urn:hex:entity:same;OTHER",
    type: "Entity",
    text: "same",
    level: 1
  },
  {
    id: "urn:hex:entity:command line tool;OTHER",
    type: "Entity",
    text: "command line tool",
    level: 1
  },
  {
    id: "urn:hex:entity:editor;PERSON",
    type: "Entity",
    text: "editor",
    level: 1
  },
  {
    id: "urn:hex:entity:Slack;OTHER",
    type: "Entity",
    text: "Slack",
    level: 1
  },
  {
    id: "urn:hex:capture:ff29cf6b-d1dd-4780-b3e8-ffb71909cf92",
    type: "Capture",
    text:
      "Randy Brown offered to write Tangle a letter of recommendation for YC",
    level: 0
  },
  {
    id: "urn:hex:entity:YC;PERSON",
    type: "Entity",
    text: "YC",
    level: 1
  },
  {
    id: "urn:hex:entity:recommendation;OTHER",
    type: "Entity",
    text: "recommendation",
    level: 1
  },
  {
    id: "urn:hex:entity:letter;WORK_OF_ART",
    type: "Entity",
    text: "letter",
    level: 1
  },
  {
    id: "urn:hex:entity:Randy Brown;PERSON",
    type: "Entity",
    text: "Randy Brown",
    level: 1
  },
  {
    id: "urn:hex:capture:596d2f44-f6f4-44e4-b023-55d0724c6d5e",
    type: "Capture",
    text:
      "Randy Brown thinks that YC is best for the network. Demo day creates a marketplace with that drives up demand.",
    level: 1
  },
  {
    id: "urn:hex:capture:a0049353-71d2-4eb3-a2e0-25902e7e67e3",
    type: "Capture",
    text:
      "Randy Brown was accepted to YC in 2015 for Jopwell. The was during the seed investing bubble\n",
    level: 1
  },
  {
    id: "urn:hex:capture:23428810-dd0b-4aca-9602-a96564abaa6c",
    type: "Capture",
    text:
      "Randy Brown is an Evernote user and offered to allow use to use his notebook as a test",
    level: 1
  },
  {
    id: "urn:hex:capture:987bc420-41f8-4e76-a444-849f65bfe430",
    type: "Capture",
    text:
      "Randy Brown was the CTO of Jopwell and is now the founder and CEO of Enrise",
    level: 1
  },
  {
    id: "urn:hex:capture:91d47176-f275-4f91-a480-859c9b406cbb",
    type: "Capture",
    text: "Will Minshew is our first advisor on Tangle\n",
    level: 0
  },
  {
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "Entity",
    text: "Tangle",
    level: 1
  },
  {
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Will Minshew;PERSON)",
    type: "Entity",
    text: "Will Minshew",
    level: 1
  },
  {
    id: "urn:hex:entity:NLP library;OTHER",
    type: "Entity",
    text: "NLP library",
    level: 1
  },
  {
    id: "urn:hex:entity:Spacy;OTHER",
    type: "Entity",
    text: "Spacy",
    level: 1
  },
  {
    id: "urn:hex:entity:David Dohan;PERSON",
    type: "Entity",
    text: "David Dohan",
    level: 1
  },
  {
    id: "urn:hex:capture:fd018fda-613c-4e2d-92ff-d20a0300beb2",
    type: "Capture",
    text:
      "David Dohan thought that the temporal relevance graph layout would be interesting to explore",
    level: 1
  },
  {
    id: "urn:hex:capture:a0998633-1983-46ec-a729-e7d1ea7b98c5",
    type: "Capture",
    text: "David Dohan was roommates with Jasper Ryckman at Princeton",
    level: 1
  },
  {
    id: "urn:hex:capture:8d3a9e6d-7816-4bb4-8e77-ced9bb82e8f4",
    type: "Capture",
    text:
      "David Dohan believes that knowledge management is a AI complete problem",
    level: 1
  },
  {
    id: "urn:hex:capture:238af16e-6ee5-4147-a029-b764f687eed4",
    type: "Capture",
    text:
      "David Dohan calls knowledge management the philosophers stone of computer science",
    level: 1
  },
  {
    id: "urn:hex:capture:7f92d5c1-b3cd-4bc5-bfa9-b0c1ac4b838b",
    type: "Capture",
    text:
      "David Dohan is going to take his notes from Todoist and then embed them, drawing connections between them based on distance between them",
    level: 1
  },
  {
    id: "urn:hex:capture:39c2b380-3466-4843-9095-d676f37b2bfd",
    type: "Capture",
    text:
      "David Dohan uses Todoist for his note taking because its api allows him to import via JSON",
    level: 1
  },
  {
    id: "urn:hex:capture:aa78f812-3441-4a53-baaf-7848e6c287bb",
    type: "Capture",
    text: "David Dohan works on language embeddings for Google Research",
    level: 1
  },
  {
    id: "urn:hex:capture:01844ecc-3183-4152-9510-55591951fb81",
    type: "Capture",
    text: "David Dohan went to Princeton in 2015 and studied computer science",
    level: 1
  },
  {
    id: "urn:hex:tag:pitch",
    type: "Tag",
    text: "pitch",
    level: 1
  },
  {
    id: "urn:hex:entity:demo;WORK_OF_ART",
    type: "Entity",
    text: "demo",
    level: 1
  },
  {
    id: "urn:hex:entity:parties;ORGANIZATION",
    type: "Entity",
    text: "parties",
    level: 1
  },
  {
    id: "urn:hex:entity:biographies;PERSON",
    type: "Entity",
    text: "biographies",
    level: 1
  },
  {
    id: "urn:hex:entity:tangle;OTHER",
    type: "Entity",
    text: "tangle",
    level: 1
  },
  {
    id: "urn:hex:entity:background;OTHER",
    type: "Entity",
    text: "background",
    level: 1
  },
  {
    id: "urn:hex:entity:information;OTHER",
    type: "Entity",
    text: "information",
    level: 1
  },
  {
    id: "urn:hex:entity:idea;OTHER",
    type: "Entity",
    text: "idea",
    level: 1
  },
  {
    id: "urn:hex:capture:68f60fea-7f04-42b9-83a2-f81fe4923150",
    type: "Capture",
    text:
      "Robert Drucker, the HBS professor discusses how important it is to know if you are a reader or a listener. How do you best ingest information?",
    level: 1
  },
  {
    id: "urn:hex:entity:type ahead feature;OTHER",
    type: "Entity",
    text: "type ahead feature",
    level: 1
  },
  {
    id: "urn:hex:entity:captures;OTHER",
    type: "Entity",
    text: "captures",
    level: 1
  },
  {
    id: "urn:hex:entity:markdown editor;PERSON",
    type: "Entity",
    text: "markdown editor",
    level: 1
  },
  {
    id: "urn:hex:entity:people;PERSON",
    type: "Entity",
    text: "people",
    level: 1
  },
  {
    id: "urn:hex:entity:reflexes;OTHER",
    type: "Entity",
    text: "reflexes",
    level: 1
  },
  {
    id: "urn:hex:entity:Andrew Choi;PERSON",
    type: "Entity",
    text: "Andrew Choi",
    level: 1
  },
  {
    id: "urn:hex:entity:reflex;OTHER",
    type: "Entity",
    text: "reflex",
    level: 1
  }
] as Array<Node>;
let edges = [
  {
    source: "urn:hex:capture:b3bf7f3a-849e-4d20-97d9-9b231561fade",
    destination: "urn:hex:entity:SV Angel;ORGANIZATION",
    type: "REFERENCES",
    salience: 0.06430850923061371
  },
  {
    source: "urn:hex:capture:b3bf7f3a-849e-4d20-97d9-9b231561fade",
    destination: "urn:hex:entity:founders;PERSON",
    type: "REFERENCES",
    salience: 0.19295771420001984
  },
  {
    source: "urn:hex:capture:b3bf7f3a-849e-4d20-97d9-9b231561fade",
    destination: "urn:hex:entity:one;OTHER",
    type: "REFERENCES",
    salience: 0.25652948021888733
  },
  {
    source: "urn:hex:capture:b3bf7f3a-849e-4d20-97d9-9b231561fade",
    destination: "urn:hex:entity:Ron Conway;PERSON",
    type: "REFERENCES",
    salience: 0.4862042963504791
  },
  {
    source: "urn:hex:capture:7070e7b6-2608-42fa-b2f1-7c519151d4d5",
    destination: "urn:hex:entity:founders;PERSON",
    type: "REFERENCES",
    salience: 0.08226661384105682
  },
  {
    source: "urn:hex:capture:7070e7b6-2608-42fa-b2f1-7c519151d4d5",
    destination: "urn:hex:entity:one;OTHER",
    type: "REFERENCES",
    salience: 0.25213244557380676
  },
  {
    source: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    destination: "urn:hex:entity:Ron Conway;PERSON",
    type: "REFERENCES",
    salience: 0.062210679054260254
  },
  {
    source: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    destination: "urn:hex:entity:folder;OTHER",
    type: "REFERENCES",
    salience: 0.005360295530408621
  },
  {
    source: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    destination: "urn:hex:entity:meeting;EVENT",
    type: "REFERENCES",
    salience: 0.005661155097186565
  },
  {
    source: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    destination: "urn:hex:entity:person;PERSON",
    type: "REFERENCES",
    salience: 0.010740437544882298
  },
  {
    source: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    destination: "urn:hex:entity:Tangle;OTHER",
    type: "REFERENCES",
    salience: 0.02135998010635376
  },
  {
    source: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    destination: "urn:hex:entity:updates;OTHER",
    type: "REFERENCES",
    salience: 0.027989378198981285
  },
  {
    source: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    destination: "urn:hex:entity:folder;OTHER",
    type: "REFERENCES",
    salience: 0.0317467525601387
  },
  {
    source: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    destination: "urn:hex:entity:system;OTHER",
    type: "REFERENCES",
    salience: 0.03490234538912773
  },
  {
    source: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    destination: "urn:hex:entity:Abram Dawson;PERSON",
    type: "REFERENCES",
    salience: 0.8000289797782898
  },
  {
    source: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
    destination: "urn:hex:entity:Tangle;OTHER",
    type: "REFERENCES",
    salience: 0.13940460979938507
  },
  {
    source: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    destination: "urn:hex:entity:Tangle;OTHER",
    type: "REFERENCES",
    salience: 0.07984904944896698
  },
  {
    source: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
    destination: "urn:hex:entity:Tangle;OTHER",
    type: "REFERENCES",
    salience: 0.0845857709646225
  },
  {
    source: "urn:hex:capture:fe11ef6e-e8cf-4feb-978d-2b1a7484ae98",
    destination: "urn:hex:entity:system;OTHER",
    type: "REFERENCES",
    salience: 0.02160600572824478
  },
  {
    source: "urn:hex:capture:fe11ef6e-e8cf-4feb-978d-2b1a7484ae98",
    destination: "urn:hex:entity:Abram Dawson;PERSON",
    type: "REFERENCES",
    salience: 0.5596245527267456
  },
  {
    source: "urn:hex:capture:b7ed02ed-1c3a-416e-b626-ecd326cc2b5b",
    destination: "urn:hex:entity:Abram Dawson;PERSON",
    type: "REFERENCES",
    salience: 0.7444974780082703
  },
  {
    source: "urn:hex:capture:83b60c40-92f2-4a0c-baf4-b16a1edaabb4",
    destination: "urn:hex:entity:Abram Dawson;PERSON",
    type: "REFERENCES",
    salience: 0.5870957970619202
  },
  {
    source: "urn:hex:capture:a2c80f3d-33de-48cb-bb17-74b258c56e5d",
    destination: "urn:hex:entity:Abram Dawson;PERSON",
    type: "REFERENCES",
    salience: 0.6865059733390808
  },
  {
    source: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    destination: "urn:hex:entity:Abram Dawson;PERSON",
    type: "REFERENCES",
    salience: 0.11355186253786087
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:entity:Abram Dawson;PERSON",
    type: "REFERENCES",
    salience: 0.1783536970615387
  },
  {
    source: "urn:hex:capture:eac6c020-acf5-45f2-a1fa-3f14d4f216f8",
    destination: "urn:hex:entity:Abram Dawson;PERSON",
    type: "REFERENCES",
    salience: 0.6813998222351074
  },
  {
    source: "urn:hex:capture:8f4d5e72-c06e-4e21-9d0f-77e6e109466c",
    destination: "urn:hex:entity:Abram Dawson;PERSON",
    type: "REFERENCES",
    salience: 0.9108039140701294
  },
  {
    source: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
    destination: "urn:hex:entity:CRM;OTHER",
    type: "REFERENCES",
    salience: 0.1324101686477661
  },
  {
    source: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
    destination: "urn:hex:entity:value;OTHER",
    type: "REFERENCES",
    salience: 0.2592402696609497
  },
  {
    source: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
    destination: "urn:hex:entity:PLG Ventures;ORGANIZATION",
    type: "REFERENCES",
    salience: 0.5237637758255005
  },
  {
    source: "urn:hex:capture:fe11ef6e-e8cf-4feb-978d-2b1a7484ae98",
    destination: "urn:hex:entity:CRM;OTHER",
    type: "REFERENCES",
    salience: 0.14354772865772247
  },
  {
    source: "urn:hex:capture:fe11ef6e-e8cf-4feb-978d-2b1a7484ae98",
    destination: "urn:hex:entity:value;OTHER",
    type: "REFERENCES",
    salience: 0.06464309990406036
  },
  {
    source: "urn:hex:capture:d61a6f07-7974-4c8d-8f2c-7be05c6c9c69",
    destination: "urn:hex:entity:value;OTHER",
    type: "REFERENCES",
    salience: 0.14059387147426605
  },
  {
    source: "urn:hex:capture:d548566c-fd88-4080-9e81-903ef6fce887",
    destination: "urn:hex:entity:PLG Ventures;ORGANIZATION",
    type: "REFERENCES",
    salience: 0.6181963086128235
  },
  {
    source: "urn:hex:capture:1d9e61d8-1567-45c7-960e-b52145572480",
    destination: "urn:hex:entity:PLG Ventures;ORGANIZATION",
    type: "REFERENCES",
    salience: 0.0913330465555191
  },
  {
    source: "urn:hex:capture:7653822f-b5ed-415a-853b-3b0af829f0d2",
    destination: "urn:hex:entity:PLG Ventures;ORGANIZATION",
    type: "REFERENCES",
    salience: 0.0913330465555191
  },
  {
    source: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    destination: "urn:hex:tag:design",
    type: "TAGGED_WITH",
    salience: null
  },
  {
    source: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    destination: "urn:hex:tag:features",
    type: "TAGGED_WITH",
    salience: null
  },
  {
    source: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    destination: "urn:hex:entity:capture;OTHER",
    type: "REFERENCES",
    salience: 0.03795275464653969
  },
  {
    source: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    destination: "urn:hex:entity:Tangle input;OTHER",
    type: "REFERENCES",
    salience: 0.03795275464653969
  },
  {
    source: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    destination: "urn:hex:entity:same;OTHER",
    type: "REFERENCES",
    salience: 0.06718713045120239
  },
  {
    source: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    destination: "urn:hex:entity:command line tool;OTHER",
    type: "REFERENCES",
    salience: 0.07644133269786835
  },
  {
    source: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    destination: "urn:hex:entity:editor;PERSON",
    type: "REFERENCES",
    salience: 0.11450837552547455
  },
  {
    source: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    destination: "urn:hex:entity:Slack;OTHER",
    type: "REFERENCES",
    salience: 0.5524057745933533
  },
  {
    source: "urn:hex:capture:ff29cf6b-d1dd-4780-b3e8-ffb71909cf92",
    destination: "urn:hex:entity:YC;PERSON",
    type: "REFERENCES",
    salience: 0.06696028262376785
  },
  {
    source: "urn:hex:capture:ff29cf6b-d1dd-4780-b3e8-ffb71909cf92",
    destination: "urn:hex:entity:recommendation;OTHER",
    type: "REFERENCES",
    salience: 0.07084773480892181
  },
  {
    source: "urn:hex:capture:ff29cf6b-d1dd-4780-b3e8-ffb71909cf92",
    destination: "urn:hex:entity:letter;WORK_OF_ART",
    type: "REFERENCES",
    salience: 0.2009143829345703
  },
  {
    source: "urn:hex:capture:ff29cf6b-d1dd-4780-b3e8-ffb71909cf92",
    destination: "urn:hex:entity:Randy Brown;PERSON",
    type: "REFERENCES",
    salience: 0.6612775921821594
  },
  {
    source: "urn:hex:capture:d61a6f07-7974-4c8d-8f2c-7be05c6c9c69",
    destination: "urn:hex:entity:YC;PERSON",
    type: "REFERENCES",
    salience: 0.14027097821235657
  },
  {
    source: "urn:hex:capture:596d2f44-f6f4-44e4-b023-55d0724c6d5e",
    destination: "urn:hex:entity:YC;PERSON",
    type: "REFERENCES",
    salience: 0.22472356259822845
  },
  {
    source: "urn:hex:capture:a0049353-71d2-4eb3-a2e0-25902e7e67e3",
    destination: "urn:hex:entity:Randy Brown;PERSON",
    type: "REFERENCES",
    salience: 0.5774629712104797
  },
  {
    source: "urn:hex:capture:d61a6f07-7974-4c8d-8f2c-7be05c6c9c69",
    destination: "urn:hex:entity:Randy Brown;PERSON",
    type: "REFERENCES",
    salience: 0.28893646597862244
  },
  {
    source: "urn:hex:capture:596d2f44-f6f4-44e4-b023-55d0724c6d5e",
    destination: "urn:hex:entity:Randy Brown;PERSON",
    type: "REFERENCES",
    salience: 0.4720342457294464
  },
  {
    source: "urn:hex:capture:23428810-dd0b-4aca-9602-a96564abaa6c",
    destination: "urn:hex:entity:Randy Brown;PERSON",
    type: "REFERENCES",
    salience: 0.7761675715446472
  },
  {
    source: "urn:hex:capture:987bc420-41f8-4e76-a444-849f65bfe430",
    destination: "urn:hex:entity:Randy Brown;PERSON",
    type: "REFERENCES",
    salience: 0.7702342867851257
  },
  {
    source: "urn:hex:capture:91d47176-f275-4f91-a480-859c9b406cbb",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.14625893533229828
  },
  {
    source: "urn:hex:capture:91d47176-f275-4f91-a480-859c9b406cbb",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Will Minshew;PERSON)",
    type: "REFERENCES",
    salience: 0.8537410497665405
  },
  {
    source: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
    destination: "urn:hex:entity:NLP library;OTHER",
    type: "REFERENCES",
    salience: 0.08874096721410751
  },
  {
    source: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
    destination: "urn:hex:entity:Spacy;OTHER",
    type: "REFERENCES",
    salience: 0.16869458556175232
  },
  {
    source: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
    destination: "urn:hex:entity:David Dohan;PERSON",
    type: "REFERENCES",
    salience: 0.6031598448753357
  },
  {
    source: "urn:hex:capture:fd018fda-613c-4e2d-92ff-d20a0300beb2",
    destination: "urn:hex:entity:David Dohan;PERSON",
    type: "REFERENCES",
    salience: 0.6334075927734375
  },
  {
    source: "urn:hex:capture:a0998633-1983-46ec-a729-e7d1ea7b98c5",
    destination: "urn:hex:entity:David Dohan;PERSON",
    type: "REFERENCES",
    salience: 0.585903525352478
  },
  {
    source: "urn:hex:capture:8d3a9e6d-7816-4bb4-8e77-ced9bb82e8f4",
    destination: "urn:hex:entity:David Dohan;PERSON",
    type: "REFERENCES",
    salience: 0.18463481962680817
  },
  {
    source: "urn:hex:capture:238af16e-6ee5-4147-a029-b764f687eed4",
    destination: "urn:hex:entity:David Dohan;PERSON",
    type: "REFERENCES",
    salience: 0.5179306864738464
  },
  {
    source: "urn:hex:capture:7f92d5c1-b3cd-4bc5-bfa9-b0c1ac4b838b",
    destination: "urn:hex:entity:David Dohan;PERSON",
    type: "REFERENCES",
    salience: 0.5382853746414185
  },
  {
    source: "urn:hex:capture:39c2b380-3466-4843-9095-d676f37b2bfd",
    destination: "urn:hex:entity:David Dohan;PERSON",
    type: "REFERENCES",
    salience: 0.5603286623954773
  },
  {
    source: "urn:hex:capture:aa78f812-3441-4a53-baaf-7848e6c287bb",
    destination: "urn:hex:entity:David Dohan;PERSON",
    type: "REFERENCES",
    salience: 0.47493046522140503
  },
  {
    source: "urn:hex:capture:01844ecc-3183-4152-9510-55591951fb81",
    destination: "urn:hex:entity:David Dohan;PERSON",
    type: "REFERENCES",
    salience: 0.6815688610076904
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:tag:pitch",
    type: "TAGGED_WITH",
    salience: null
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:entity:demo;WORK_OF_ART",
    type: "REFERENCES",
    salience: 0.033877186477184296
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:entity:parties;ORGANIZATION",
    type: "REFERENCES",
    salience: 0.03687840700149536
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:entity:biographies;PERSON",
    type: "REFERENCES",
    salience: 0.0740901306271553
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:entity:tangle;OTHER",
    type: "REFERENCES",
    salience: 0.0740901306271553
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:entity:background;OTHER",
    type: "REFERENCES",
    salience: 0.07497811317443848
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:entity:information;OTHER",
    type: "REFERENCES",
    salience: 0.084986113011837
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:entity:information;OTHER",
    type: "REFERENCES",
    salience: 0.17728471755981445
  },
  {
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination: "urn:hex:entity:idea;OTHER",
    type: "REFERENCES",
    salience: 0.2654615044593811
  },
  {
    source: "urn:hex:capture:68f60fea-7f04-42b9-83a2-f81fe4923150",
    destination: "urn:hex:entity:information;OTHER",
    type: "REFERENCES",
    salience: 0.014221927151083946
  },
  {
    source: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    destination: "urn:hex:entity:type ahead feature;OTHER",
    type: "REFERENCES",
    salience: 0.011901456862688065
  },
  {
    source: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    destination: "urn:hex:entity:captures;OTHER",
    type: "REFERENCES",
    salience: 0.021560367196798325
  },
  {
    source: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    destination: "urn:hex:entity:markdown editor;PERSON",
    type: "REFERENCES",
    salience: 0.03890015184879303
  },
  {
    source: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    destination: "urn:hex:entity:people;PERSON",
    type: "REFERENCES",
    salience: 0.11532773822546005
  },
  {
    source: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    destination: "urn:hex:entity:captures;OTHER",
    type: "REFERENCES",
    salience: 0.1195262148976326
  },
  {
    source: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    destination: "urn:hex:entity:reflexes;OTHER",
    type: "REFERENCES",
    salience: 0.13051481544971466
  },
  {
    source: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    destination: "urn:hex:entity:Andrew Choi;PERSON",
    type: "REFERENCES",
    salience: 0.1971680223941803
  },
  {
    source: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    destination: "urn:hex:entity:reflex;OTHER",
    type: "REFERENCES",
    salience: 0.285252183675766
  },
  {
    source: "urn:hex:capture:7070e7b6-2608-42fa-b2f1-7c519151d4d5",
    destination: "urn:hex:entity:Andrew Choi;PERSON",
    type: "REFERENCES",
    salience: 0.5878483653068542
  }
] as Array<Edge>;
