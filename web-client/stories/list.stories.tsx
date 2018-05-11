import * as React from "react";

import * as generatedTypes from "../src/__generated__/types";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean, select } from "@storybook/addon-knobs/react";

import ListHeader from "../src/components/list-header";
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

let listData = [
  {
    __typename: "ListItem",
    id: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
    text: {
      __typename: "AnnotatedText",
      text:
        "Andrew Choi though it was important that we teach people the right reflexes when using Tangle. Having a full markdown editor does not teach the right reflex, where as having a type ahead feature does as it ensures you write captures that connect to other captures.",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andrew Choi though it was important that we teach people the right reflexes when using Tangle. Having a full markdown editor does not teach the right reflex, where as having a type ahead feature does as it ensures you write captures that connect to other captures.",
          annotations: [
            {
              __typename: "Annotation",
              start: 176,
              end: 194,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 224,
              end: 232,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 224,
              end: 232,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 109,
              end: 124,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 87,
              end: 93,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 50,
              end: 56,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 224,
              end: 232,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 224,
              end: 232,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 67,
              end: 75,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 67,
              end: 73,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "type ahead feature",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "captures",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "captures",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "markdown editor",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "people",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "captures",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "captures",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "reflexes",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Andrew Choi",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "reflex",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan recommended using Spacy for our NLP library for Tangle",
          annotations: [
            {
              __typename: "Annotation",
              start: 60,
              end: 66,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson told us that Ron Conway has a system for doing what Tangle proposes to do for you. He has a folder on each person that he meets with and updates it after he meets with them again. He then reviews that folder before each meeting",
          annotations: [
            {
              __typename: "Annotation",
              start: 65,
              end: 71,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
        text: {
          __typename: "AnnotatedText",
          text:
            "PLG Ventures also immediately saw the value of Tangle as a CRM",
          annotations: [
            {
              __typename: "Annotation",
              start: 47,
              end: 53,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:7070e7b6-2608-42fa-b2f1-7c519151d4d5",
        text: {
          __typename: "AnnotatedText",
          text: "Andrew Choi is close with one of the founders of Product Hunt",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Andrew Choi",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:91d47176-f275-4f91-a480-859c9b406cbb",
    text: {
      __typename: "AnnotatedText",
      text: "Will Minshew is our first advisor on Tangle\n",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:91d47176-f275-4f91-a480-859c9b406cbb",
        text: {
          __typename: "AnnotatedText",
          text: "Will Minshew is our first advisor on Tangle\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 37,
              end: 43,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Will Minshew",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
    text: {
      __typename: "AnnotatedText",
      text:
        "David Dohan recommended using Spacy for our NLP library for Tangle",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan recommended using Spacy for our NLP library for Tangle",
          annotations: [
            {
              __typename: "Annotation",
              start: 44,
              end: 55,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 60,
              end: 66,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 30,
              end: 35,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "NLP library",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Spacy",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "David Dohan",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andrew Choi though it was important that we teach people the right reflexes when using Tangle. Having a full markdown editor does not teach the right reflex, where as having a type ahead feature does as it ensures you write captures that connect to other captures.",
          annotations: [
            {
              __typename: "Annotation",
              start: 87,
              end: 93,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson told us that Ron Conway has a system for doing what Tangle proposes to do for you. He has a folder on each person that he meets with and updates it after he meets with them again. He then reviews that folder before each meeting",
          annotations: [
            {
              __typename: "Annotation",
              start: 65,
              end: 71,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
        text: {
          __typename: "AnnotatedText",
          text:
            "PLG Ventures also immediately saw the value of Tangle as a CRM",
          annotations: [
            {
              __typename: "Annotation",
              start: 47,
              end: 53,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:fd018fda-613c-4e2d-92ff-d20a0300beb2",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan thought that the temporal relevance graph layout would be interesting to explore",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "David Dohan",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a0998633-1983-46ec-a729-e7d1ea7b98c5",
        text: {
          __typename: "AnnotatedText",
          text: "David Dohan was roommates with Jasper Ryckman at Princeton",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "David Dohan",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:8d3a9e6d-7816-4bb4-8e77-ced9bb82e8f4",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan believes that knowledge management is a AI complete problem",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "David Dohan",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:238af16e-6ee5-4147-a029-b764f687eed4",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan calls knowledge management the philosophers stone of computer science",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "David Dohan",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:7f92d5c1-b3cd-4bc5-bfa9-b0c1ac4b838b",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan is going to take his notes from Todoist and then embed them, drawing connections between them based on distance between them",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "David Dohan",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:39c2b380-3466-4843-9095-d676f37b2bfd",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan uses Todoist for his note taking because its api allows him to import via JSON",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "David Dohan",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:aa78f812-3441-4a53-baaf-7848e6c287bb",
        text: {
          __typename: "AnnotatedText",
          text: "David Dohan works on language embeddings for Google Research",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "David Dohan",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:01844ecc-3183-4152-9510-55591951fb81",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan went to Princeton in 2015 and studied computer science",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "David Dohan",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:ff29cf6b-d1dd-4780-b3e8-ffb71909cf92",
    text: {
      __typename: "AnnotatedText",
      text:
        "Randy Brown offered to write Tangle a letter of recommendation for YC",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:d61a6f07-7974-4c8d-8f2c-7be05c6c9c69",
        text: {
          __typename: "AnnotatedText",
          text:
            "Randy Brown said that doing YC is more about the longterm value. You are a part of the YC alumni network and have access to everyone as customers and advisers",
          annotations: [
            {
              __typename: "Annotation",
              start: 28,
              end: 30,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "YC",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Randy Brown",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:596d2f44-f6f4-44e4-b023-55d0724c6d5e",
        text: {
          __typename: "AnnotatedText",
          text:
            "Randy Brown thinks that YC is best for the network. Demo day creates a marketplace with that drives up demand.",
          annotations: [
            {
              __typename: "Annotation",
              start: 24,
              end: 26,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "YC",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Randy Brown",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:ff29cf6b-d1dd-4780-b3e8-ffb71909cf92",
        text: {
          __typename: "AnnotatedText",
          text:
            "Randy Brown offered to write Tangle a letter of recommendation for YC",
          annotations: [
            {
              __typename: "Annotation",
              start: 67,
              end: 69,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 48,
              end: 62,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 38,
              end: 44,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "YC",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "recommendation",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "letter",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Randy Brown",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a0049353-71d2-4eb3-a2e0-25902e7e67e3",
        text: {
          __typename: "AnnotatedText",
          text:
            "Randy Brown was accepted to YC in 2015 for Jopwell. The was during the seed investing bubble\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Randy Brown",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:23428810-dd0b-4aca-9602-a96564abaa6c",
        text: {
          __typename: "AnnotatedText",
          text:
            "Randy Brown is an Evernote user and offered to allow use to use his notebook as a test",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Randy Brown",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:987bc420-41f8-4e76-a444-849f65bfe430",
        text: {
          __typename: "AnnotatedText",
          text:
            "Randy Brown was the CTO of Jopwell and is now the founder and CEO of Enrise",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 11,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Randy Brown",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    text: {
      __typename: "AnnotatedText",
      text:
        "Abram Dawson had the idea that we should seed a tangle with our biographies and background as well as information about who we are meeting with so that the demo contains information that will be familiar for all parties #pitch",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson had the idea that we should seed a tangle with our biographies and background as well as information about who we are meeting with so that the demo contains information that will be familiar for all parties #pitch",
          annotations: [
            {
              __typename: "Annotation",
              start: 156,
              end: 160,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 212,
              end: 219,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 64,
              end: 75,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 48,
              end: 54,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 80,
              end: 90,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 102,
              end: 113,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 102,
              end: 113,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 102,
              end: 113,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 102,
              end: 113,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 21,
              end: 25,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "pitch",
            reasonType: "SHARES_TAG"
          },
          {
            __typename: "RecommendationReason",
            pivot: "demo",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "parties",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "biographies",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "tangle",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "background",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "information",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "information",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "information",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "information",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "idea",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:68f60fea-7f04-42b9-83a2-f81fe4923150",
        text: {
          __typename: "AnnotatedText",
          text:
            "Robert Drucker, the HBS professor discusses how important it is to know if you are a reader or a listener. How do you best ingest information?",
          annotations: [
            {
              __typename: "Annotation",
              start: 130,
              end: 141,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 130,
              end: 141,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "information",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "information",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:fe11ef6e-e8cf-4feb-978d-2b1a7484ae98",
        text: {
          __typename: "AnnotatedText",
          text:
            "When we met Abram Dawson he was switching from Salesforce to a new CRM. He immediately saw the value of system focused on making connections via unstructured inputs or thoughts\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 12,
              end: 24,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:b7ed02ed-1c3a-416e-b626-ecd326cc2b5b",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson was introduced to us via Will Minshew because they play Settlers of Catan together\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:83b60c40-92f2-4a0c-baf4-b16a1edaabb4",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson is going to introduce us to Ryan Hoover, the founder of Product Hunt\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a2c80f3d-33de-48cb-bb17-74b258c56e5d",
        text: {
          __typename: "AnnotatedText",
          text: "Abram Dawson was Forbes 30 Under 30 for VC\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson told us that Ron Conway has a system for doing what Tangle proposes to do for you. He has a folder on each person that he meets with and updates it after he meets with them again. He then reviews that folder before each meeting",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson liked that Slack used an editor that operates like a command line tool and thought that we should do the same with the Tangle input or capture #features #design",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:eac6c020-acf5-45f2-a1fa-3f14d4f216f8",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson offered to introduce us to his friend Justin Mars who he described as Tim Ferris\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:8f4d5e72-c06e-4e21-9d0f-77e6e109466c",
        text: {
          __typename: "AnnotatedText",
          text: "Abram Dawson is a principal at SV Angels in San Francisco",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
    text: {
      __typename: "AnnotatedText",
      text: "PLG Ventures also immediately saw the value of Tangle as a CRM",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan recommended using Spacy for our NLP library for Tangle",
          annotations: [
            {
              __typename: "Annotation",
              start: 60,
              end: 66,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andrew Choi though it was important that we teach people the right reflexes when using Tangle. Having a full markdown editor does not teach the right reflex, where as having a type ahead feature does as it ensures you write captures that connect to other captures.",
          annotations: [
            {
              __typename: "Annotation",
              start: 87,
              end: 93,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson told us that Ron Conway has a system for doing what Tangle proposes to do for you. He has a folder on each person that he meets with and updates it after he meets with them again. He then reviews that folder before each meeting",
          annotations: [
            {
              __typename: "Annotation",
              start: 65,
              end: 71,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
        text: {
          __typename: "AnnotatedText",
          text:
            "PLG Ventures also immediately saw the value of Tangle as a CRM",
          annotations: [
            {
              __typename: "Annotation",
              start: 47,
              end: 53,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 59,
              end: 62,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 38,
              end: 43,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "CRM",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "value",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "PLG Ventures",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:fe11ef6e-e8cf-4feb-978d-2b1a7484ae98",
        text: {
          __typename: "AnnotatedText",
          text:
            "When we met Abram Dawson he was switching from Salesforce to a new CRM. He immediately saw the value of system focused on making connections via unstructured inputs or thoughts\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 67,
              end: 70,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 95,
              end: 100,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "CRM",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "value",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:d61a6f07-7974-4c8d-8f2c-7be05c6c9c69",
        text: {
          __typename: "AnnotatedText",
          text:
            "Randy Brown said that doing YC is more about the longterm value. You are a part of the YC alumni network and have access to everyone as customers and advisers",
          annotations: [
            {
              __typename: "Annotation",
              start: 58,
              end: 63,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "value",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:d548566c-fd88-4080-9e81-903ef6fce887",
        text: {
          __typename: "AnnotatedText",
          text: "PLG Ventures and Chaac Ventures share an office in LA",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "PLG Ventures",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:1d9e61d8-1567-45c7-960e-b52145572480",
        text: {
          __typename: "AnnotatedText",
          text: "Patrick Goldberg is the founder of PLG Ventures",
          annotations: [
            {
              __typename: "Annotation",
              start: 35,
              end: 47,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "PLG Ventures",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:7653822f-b5ed-415a-853b-3b0af829f0d2",
        text: {
          __typename: "AnnotatedText",
          text: "Elaine Russel is a partner at PLG Ventures",
          annotations: [
            {
              __typename: "Annotation",
              start: 30,
              end: 42,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "PLG Ventures",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:b3bf7f3a-849e-4d20-97d9-9b231561fade",
    text: {
      __typename: "AnnotatedText",
      text: "Ron Conway is one of the founders of SV Angel",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:b3bf7f3a-849e-4d20-97d9-9b231561fade",
        text: {
          __typename: "AnnotatedText",
          text: "Ron Conway is one of the founders of SV Angel",
          annotations: [
            {
              __typename: "Annotation",
              start: 37,
              end: 45,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 25,
              end: 33,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 14,
              end: 17,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 10,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "SV Angel",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "founders",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "one",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Ron Conway",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:7070e7b6-2608-42fa-b2f1-7c519151d4d5",
        text: {
          __typename: "AnnotatedText",
          text: "Andrew Choi is close with one of the founders of Product Hunt",
          annotations: [
            {
              __typename: "Annotation",
              start: 37,
              end: 45,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 26,
              end: 29,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "founders",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "one",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson told us that Ron Conway has a system for doing what Tangle proposes to do for you. He has a folder on each person that he meets with and updates it after he meets with them again. He then reviews that folder before each meeting",
          annotations: [
            {
              __typename: "Annotation",
              start: 26,
              end: 36,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Ron Conway",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
    text: {
      __typename: "AnnotatedText",
      text:
        "Abram Dawson liked that Slack used an editor that operates like a command line tool and thought that we should do the same with the Tangle input or capture #features #design",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson liked that Slack used an editor that operates like a command line tool and thought that we should do the same with the Tangle input or capture #features #design",
          annotations: [
            {
              __typename: "Annotation",
              start: 148,
              end: 155,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 132,
              end: 144,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 118,
              end: 122,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 66,
              end: 83,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 38,
              end: 44,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 24,
              end: 29,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "design",
            reasonType: "SHARES_TAG"
          },
          {
            __typename: "RecommendationReason",
            pivot: "features",
            reasonType: "SHARES_TAG"
          },
          {
            __typename: "RecommendationReason",
            pivot: "capture",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Tangle input",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "same",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "command line tool",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "editor",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Slack",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:fe11ef6e-e8cf-4feb-978d-2b1a7484ae98",
        text: {
          __typename: "AnnotatedText",
          text:
            "When we met Abram Dawson he was switching from Salesforce to a new CRM. He immediately saw the value of system focused on making connections via unstructured inputs or thoughts\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 12,
              end: 24,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:b7ed02ed-1c3a-416e-b626-ecd326cc2b5b",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson was introduced to us via Will Minshew because they play Settlers of Catan together\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:83b60c40-92f2-4a0c-baf4-b16a1edaabb4",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson is going to introduce us to Ryan Hoover, the founder of Product Hunt\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a2c80f3d-33de-48cb-bb17-74b258c56e5d",
        text: {
          __typename: "AnnotatedText",
          text: "Abram Dawson was Forbes 30 Under 30 for VC\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson told us that Ron Conway has a system for doing what Tangle proposes to do for you. He has a folder on each person that he meets with and updates it after he meets with them again. He then reviews that folder before each meeting",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson had the idea that we should seed a tangle with our biographies and background as well as information about who we are meeting with so that the demo contains information that will be familiar for all parties #pitch",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:eac6c020-acf5-45f2-a1fa-3f14d4f216f8",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson offered to introduce us to his friend Justin Mars who he described as Tim Ferris\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:8f4d5e72-c06e-4e21-9d0f-77e6e109466c",
        text: {
          __typename: "AnnotatedText",
          text: "Abram Dawson is a principal at SV Angels in San Francisco",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
    text: {
      __typename: "AnnotatedText",
      text:
        "Abram Dawson told us that Ron Conway has a system for doing what Tangle proposes to do for you. He has a folder on each person that he meets with and updates it after he meets with them again. He then reviews that folder before each meeting",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:61b48839-d6c6-48a6-b4d6-2d173208a30c",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson told us that Ron Conway has a system for doing what Tangle proposes to do for you. He has a folder on each person that he meets with and updates it after he meets with them again. He then reviews that folder before each meeting",
          annotations: [
            {
              __typename: "Annotation",
              start: 105,
              end: 111,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 105,
              end: 111,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 233,
              end: 240,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 120,
              end: 126,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 65,
              end: 71,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 150,
              end: 157,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 105,
              end: 111,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 105,
              end: 111,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 43,
              end: 49,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 26,
              end: 36,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "folder",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "folder",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "meeting",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "person",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "updates",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "folder",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "folder",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "system",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Ron Conway",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan recommended using Spacy for our NLP library for Tangle",
          annotations: [
            {
              __typename: "Annotation",
              start: 60,
              end: 66,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:4bc18689-1675-4111-b44b-6a15a255c26e",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andrew Choi though it was important that we teach people the right reflexes when using Tangle. Having a full markdown editor does not teach the right reflex, where as having a type ahead feature does as it ensures you write captures that connect to other captures.",
          annotations: [
            {
              __typename: "Annotation",
              start: 87,
              end: 93,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:71efa1de-110b-432e-a6e8-fa2da50af8fd",
        text: {
          __typename: "AnnotatedText",
          text:
            "PLG Ventures also immediately saw the value of Tangle as a CRM",
          annotations: [
            {
              __typename: "Annotation",
              start: 47,
              end: 53,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:fe11ef6e-e8cf-4feb-978d-2b1a7484ae98",
        text: {
          __typename: "AnnotatedText",
          text:
            "When we met Abram Dawson he was switching from Salesforce to a new CRM. He immediately saw the value of system focused on making connections via unstructured inputs or thoughts\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 104,
              end: 110,
              type: "HIGHLIGHT"
            },
            {
              __typename: "Annotation",
              start: 12,
              end: 24,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "system",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:b3bf7f3a-849e-4d20-97d9-9b231561fade",
        text: {
          __typename: "AnnotatedText",
          text: "Ron Conway is one of the founders of SV Angel",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 10,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Ron Conway",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:b7ed02ed-1c3a-416e-b626-ecd326cc2b5b",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson was introduced to us via Will Minshew because they play Settlers of Catan together\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:83b60c40-92f2-4a0c-baf4-b16a1edaabb4",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson is going to introduce us to Ryan Hoover, the founder of Product Hunt\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a2c80f3d-33de-48cb-bb17-74b258c56e5d",
        text: {
          __typename: "AnnotatedText",
          text: "Abram Dawson was Forbes 30 Under 30 for VC\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:445e321e-3497-4a69-a1c7-851aec97a5f9",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson liked that Slack used an editor that operates like a command line tool and thought that we should do the same with the Tangle input or capture #features #design",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson had the idea that we should seed a tangle with our biographies and background as well as information about who we are meeting with so that the demo contains information that will be familiar for all parties #pitch",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:eac6c020-acf5-45f2-a1fa-3f14d4f216f8",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson offered to introduce us to his friend Justin Mars who he described as Tim Ferris\n",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:8f4d5e72-c06e-4e21-9d0f-77e6e109466c",
        text: {
          __typename: "AnnotatedText",
          text: "Abram Dawson is a principal at SV Angels in San Francisco",
          annotations: [
            {
              __typename: "Annotation",
              start: 0,
              end: 12,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Abram Dawson",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  }
] as Array<generatedTypes.ListFieldsFragment>;
