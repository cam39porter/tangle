import {
  NodeFieldsFragment,
  EdgeFieldsFragment,
  ListFieldsFragment
} from "../src/__generated__/types";

export const listData = [
  {
    __typename: "ListItem",
    id: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    text: {
      __typename: "AnnotatedText",
      text:
        "When we expose a public API for Tangle we could use this type of complexity metric in order to throttle queries\n\nhttps://blog.acolyer.org/2018/05/21/semantics-and-complexity-of-graphql/\n",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:365e7da3-2b91-4598-8a19-5a9d979aa581",
        text: {
          __typename: "AnnotatedText",
          text:
            "In order to help with name disambiguation we could parse out full names into first name and last name nodes. We could then connect full names that contain these to each as well as captures that only contain either a first or last name. This will help make Tangle as a CRM #features\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;order;OTHER)",
              __typename: "Annotation",
              start: 3,
              end: 8,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "order",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:018823a4-d197-4d66-ac6a-69339c8009ad",
        text: {
          __typename: "AnnotatedText",
          text: "More play leads to more open ended type of intelligence\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;type;OTHER)",
              __typename: "Annotation",
              start: 35,
              end: 39,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "type",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:42f3bbed-7037-473b-9394-c20f429738f9",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andy Santamaria told us a story about how the real niche user for Square was people who worked at farmers markets. These are the type of dedicated niche user we need to discover for Tangle #feedback\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;type;OTHER)",
              __typename: "Annotation",
              start: 129,
              end: 133,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 182,
              end: 188,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "type",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "Tangle",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:5afc3e10-61a3-4808-bc6d-61a605ba9f9d",
        text: {
          __typename: "AnnotatedText",
          text:
            "I imagined our Tangle retail spaces where we would allow people to come and site in lounge areas and allow their tangles to interact with other patrons tangles. This could allow for them to spark natural conversations on topics that they have both thought about. These retail spaces could become a new type of cafe or the modern philosophers cafe like in Paris during the Enlightenment #meditation\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;type;OTHER)",
              __typename: "Annotation",
              start: 302,
              end: 306,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "type",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:d64f436f-699e-4d86-8f0c-f801e170126d",
        text: {
          __typename: "AnnotatedText",
          text:
            "When performing a search in Tangle, we can treat the initial set of captures returned from the search service as the input to recommendation algorithms. This input then informs which of the related captures that we select to show the user, this way we can limit them to meaningful subset #ideas\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 28,
              end: 34,
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
        id: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
        text: {
          __typename: "AnnotatedText",
          text:
            "We need to consider the implication of building a tool, Tangle, that enables users to pass down their data between generations. This makes the assumption that the data of the last generation should inform the next and that passing down more data is more useful than the natural data transfer that occurs now. These video is an internal video from Google that speaks to this future https://www.theverge.com/2018/5/17/17344250/google-x-selfish-ledger-video-data-privacy\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 56,
              end: 62,
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
        id: "urn:hex:capture:b8664cee-4f10-4bf9-87cb-bd92c30bee81",
        text: {
          __typename: "AnnotatedText",
          text:
            "Games, songs, and situations where they are not too repetitive and there is a sense of surprise are the ones that are most enjoyed. Tangle can make knowledge management surprising and engaging by surfacing your old thoughts that you have forgotten about. These surprise seeking behavior that can be facilitated with connection is interesting to explore \n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 132,
              end: 138,
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
        id: "urn:hex:capture:741f2833-c20d-45c4-96a6-dcf53daf1be5",
        text: {
          __typename: "AnnotatedText",
          text:
            "There is a strong relationship between play, delight and curiosity. People become fascinated with things for the sheer intrigue and this create a strong sense of exploration and discovery. This is something that we could design Tangle to give people\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 228,
              end: 234,
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
        id: "urn:hex:capture:ac0c3631-1e5b-4893-a6af-8c2b5521bccf",
        text: {
          __typename: "AnnotatedText",
          text:
            "This raises the question of how you make wonder and delight a central part of the product you produce. I think that Tangle can do this for knowledge management\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 116,
              end: 122,
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
        id: "urn:hex:capture:3389d2cf-2b14-48b7-8e3b-139454c3d93d",
        text: {
          __typename: "AnnotatedText",
          text:
            "We could reframe the branding and marketing of Tangle around making note taking and knowledge management fun #marketing #branding\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
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
        id: "urn:hex:capture:39462449-030f-49aa-8fe4-72eef8884de6",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andy Santamaria worked with a consumer financial product competitor to Mint that was started by Goldman Sachs bankers. Ironically the name of their company was Tangle, but they eventually changed it. Although he received checks from them with Tangle on them\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 160,
              end: 166,
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
        id: "urn:hex:capture:9beb87fd-8984-4ac1-ba9c-34e13a9a9cbd",
        text: {
          __typename: "AnnotatedText",
          text:
            "Tangle can take advantage of the fact that a calendar contains all of the people that someone meets with. Their emails contain the people they communicate and collaborate with. Their shared documents show the people that they collaborate with. All these things together can create a graph where we can surface useful content for them #features\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 0,
              end: 6,
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
        id: "urn:hex:capture:2452cd34-4990-476c-b31e-faa9c7c40562",
        text: {
          __typename: "AnnotatedText",
          text:
            "Tangle and Tangle Teams in particular can help to develop what has come to be known as the workplace graph. Slack, Dropbox and others are working in this space as well\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 0,
              end: 6,
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
        id: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
        text: {
          __typename: "AnnotatedText",
          text:
            "David Dohan recommended using Spacy for our NLP library for Tangle",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
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
        id: "urn:hex:capture:91d47176-f275-4f91-a480-859c9b406cbb",
        text: {
          __typename: "AnnotatedText",
          text: "Will Minshew is our first advisor on Tangle\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
              __typename: "Annotation",
              start: 37,
              end: 43,
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
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:d08558ab-0c54-438d-b662-f8c92443f2e1",
    text: {
      __typename: "AnnotatedText",
      text:
        "Syntax describes the structure of sentences. Morphology describes the structure of words\n",
      annotations: []
    },
    reasons: [],
    relatedItems: []
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    text: {
      __typename: "AnnotatedText",
      text:
        "Mathew Brennan believes that segmentation leads to valuable insights. Even if 99% of users do not like your product in the alpha release, the 1% that does could represent a large portion of the population as long as you understand who they are representative of. This is similar to Tim Ferris saying that if one person like a piece of content he produces he keeps it in because he believes they represent 10,000 others\n",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:eac6c020-acf5-45f2-a1fa-3f14d4f216f8",
        text: {
          __typename: "AnnotatedText",
          text:
            "Abram Dawson offered to introduce us to his friend Justin Mars who he described as Tim Ferris \n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tim Ferris;PERSON)",
              __typename: "Annotation",
              start: 83,
              end: 93,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Tim Ferris",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:5d9a870a-15a0-48eb-92aa-b59a58b10662",
        text: {
          __typename: "AnnotatedText",
          text:
            "You can come to understand a powerful person by how they treat people less powerful than they are. These interactions reveal much about how that person views their position in the world and relationship to others\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
              __typename: "Annotation",
              start: 206,
              end: 212,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;person;PERSON)",
              __typename: "Annotation",
              start: 38,
              end: 44,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "others",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "person",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:4b35182c-a08a-4df5-bd04-283bed4e7f67",
        text: {
          __typename: "AnnotatedText",
          text:
            "Jeremy Pressman wants to start an equity share with friends where they participate in the upside of each others lives by sharing equity positions with one another. In this way networks of people can pursue higher risk paths because their success is diversified against the group as whole. This works as long as there is not a free loader problem.\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
              __typename: "Annotation",
              start: 105,
              end: 111,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "others",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:a8d17eaf-e716-480b-a358-b23f0c44e577",
        text: {
          __typename: "AnnotatedText",
          text:
            "A bar allows people to experiment with new identities and ways of interacting with others that allow new movements to take place \n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
              __typename: "Annotation",
              start: 83,
              end: 89,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "others",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:2452cd34-4990-476c-b31e-faa9c7c40562",
        text: {
          __typename: "AnnotatedText",
          text:
            "Tangle and Tangle Teams in particular can help to develop what has come to be known as the workplace graph. Slack, Dropbox and others are working in this space as well\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
              __typename: "Annotation",
              start: 127,
              end: 133,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "others",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:ca7db5e0-f56d-41f4-8701-c7603a8699e0",
        text: {
          __typename: "AnnotatedText",
          text:
            "Peter Drucker discusses the importance of having a defining purpose in life. this purpose gives you the framework for making decisions. Without you can always just actions that are bad for others as okay for you because you will do it just this once. The marginal cost is not that high.\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
              __typename: "Annotation",
              start: 189,
              end: 195,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "others",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:6dc10cfa-ac9d-4aaa-bc14-eabe709d14a5",
        text: {
          __typename: "AnnotatedText",
          text:
            "The graph visualization may be the seduction that purely data driven algorithm recommending content cannot provide. This seduction is a powerful force and art #design\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
              __typename: "Annotation",
              start: 92,
              end: 99,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "content",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:db1fe871-d471-4dca-92b3-1c61acdfc437",
        text: {
          __typename: "AnnotatedText",
          text:
            "Joy Marcus thought that Tangle did not need the graph visualization but that removing the need to organize and surfacing content automatically was interesting #feedback\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
              __typename: "Annotation",
              start: 121,
              end: 128,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "content",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:9beb87fd-8984-4ac1-ba9c-34e13a9a9cbd",
        text: {
          __typename: "AnnotatedText",
          text:
            "Tangle can take advantage of the fact that a calendar contains all of the people that someone meets with. Their emails contain the people they communicate and collaborate with. Their shared documents show the people that they collaborate with. All these things together can create a graph where we can surface useful content for them #features\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
              __typename: "Annotation",
              start: 317,
              end: 324,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "content",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:cba29c4c-304f-44f9-9137-e3fddf2500a5",
        text: {
          __typename: "AnnotatedText",
          text:
            "Fake news, and related expressions of the same, such as alternative facts, is related to gaming or misusing the underlying greedy algorithm. The result is an increase in the spread of mostly promoted and highly opinionated content\n\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
              __typename: "Annotation",
              start: 223,
              end: 230,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "content",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:620a4d53-1e9e-4aab-94e2-82e76e682e37",
        text: {
          __typename: "AnnotatedText",
          text:
            "Filter bubbles are the result of engagement-based content filtering. The underlying principle is to show the user content that relates to the content the user has previously engaged on. The result is a content stream that lacks diversification of topics and opinions.\n\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
              __typename: "Annotation",
              start: 50,
              end: 57,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "content",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:21c5ddaa-79d3-4128-9772-4bae6118f6c7",
        text: {
          __typename: "AnnotatedText",
          text:
            "According to Eugene Wei, falling into the trap of thinking other users will be like you is especially pernicious because the people building the product are usually among that early adopter cohort. The easiest north star for a product person is their own intuition. But if they're working on a product that requires customer segmentation, being in the early adopter cohort means one's instincts will keep guiding you towards the wrong North star and the company will just keep bumping into the invisible asymptote without any idea why. #growth\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
              __typename: "Annotation",
              start: 145,
              end: 152,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
              __typename: "Annotation",
              start: 145,
              end: 152,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
              __typename: "Annotation",
              start: 65,
              end: 70,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "product",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "product",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "users",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:499efccc-730a-4e4c-a623-a9d041d439f1",
        text: {
          __typename: "AnnotatedText",
          text:
            "According to Eugene Wei there's more than a whiff of Geoffrey Moore's Crossing the Chasm in this idea, some sense that moving from early adopters to the mainstream involves convincing more users to use the same product/service as early adopters do #growth\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
              __typename: "Annotation",
              start: 211,
              end: 218,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
              __typename: "Annotation",
              start: 189,
              end: 194,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "product",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "users",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:ac0c3631-1e5b-4893-a6af-8c2b5521bccf",
        text: {
          __typename: "AnnotatedText",
          text:
            "This raises the question of how you make wonder and delight a central part of the product you produce. I think that Tangle can do this for knowledge management\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
              __typename: "Annotation",
              start: 82,
              end: 89,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "product",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:2b2fe4f6-bb18-416b-babe-3756eab069fa",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andrew Chen said that the most underrated growth tactic for a SAAS is that a product should be fun. This often gets lost in all the fuss about metrics #marketing\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
              __typename: "Annotation",
              start: 77,
              end: 84,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "product",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:6fdf7235-7ef1-4e4a-846a-2f3cef4ebf28",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andy Santamaria think that right now our product is so general and is doing so many things that it is hard to focus on a particular ideal consumer. He is partially excited to work with us because he can help us hone the core consumer and design the product to really meet their needs\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
              __typename: "Annotation",
              start: 41,
              end: 48,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
              __typename: "Annotation",
              start: 41,
              end: 48,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "product",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "product",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
        text: {
          __typename: "AnnotatedText",
          text:
            "We need to consider the implication of building a tool, Tangle, that enables users to pass down their data between generations. This makes the assumption that the data of the last generation should inform the next and that passing down more data is more useful than the natural data transfer that occurs now. These video is an internal video from Google that speaks to this future https://www.theverge.com/2018/5/17/17344250/google-x-selfish-ledger-video-data-privacy\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
              __typename: "Annotation",
              start: 77,
              end: 82,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "users",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    text: {
      __typename: "AnnotatedText",
      text:
        "We noted that we had just read Brotopia and were thinking about how to avoid the pitfalls of bad culture associated with a lack of diversity\n",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:b3cf98bf-90ec-4edd-9fad-e8415f087fc4",
        text: {
          __typename: "AnnotatedText",
          text:
            "One of the main reasons people default into hiring from their network is that it easy to convince people to come work with you on risky project because there is some level of trust. It is hard to push outside of this and hire from elsewhere but this diversity of hiring people not like you can be a powerful moderating force in company. The challenge is does this push back on a startups ability to move quickly because the team is not necessarily operating from the same first principles #hiring\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;diversity;OTHER)",
              __typename: "Annotation",
              start: 250,
              end: 259,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "diversity",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:5063f3b3-3cec-4e27-bd93-2f7756f3eea2",
        text: {
          __typename: "AnnotatedText",
          text: "The book Brotopia was written by Emily Chang #hiring\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Brotopia;PERSON)",
              __typename: "Annotation",
              start: 9,
              end: 17,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "Brotopia",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    text: {
      __typename: "AnnotatedText",
      text:
        "We need to make sure in the future when we go into meetings with a VC that we have a clear ask even if that ask is not money. There should be action items on that come out of the meeting for both parties\n",
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
            "Abram Dawson had the idea that we should seed a tangle with our biographies and background as well as information about who we are meeting with so that the demo contains information that will be familiar for all parties #pitch\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;parties;ORGANIZATION)",
              __typename: "Annotation",
              start: 212,
              end: 219,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "parties",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:ef66f833-fd97-4e11-a49d-e12b07ccc8fc",
        text: {
          __typename: "AnnotatedText",
          text:
            "Joy Marcus is raising money primarily from government, especially New York, for her new fund. They are raising around 100 million dollars\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;money;OTHER)",
              __typename: "Annotation",
              start: 22,
              end: 27,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "money",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:3cca38eb-a52e-4cb0-8a3c-e9ea86701286",
        text: {
          __typename: "AnnotatedText",
          text:
            "Fred Wilson believes that financing a company is more art and science. For a startup it is important not to overextend yourself. You do not want to raise money that places a valuation on your company that you cannot be reasonable expected to meet giving your growth, revenue, and the multiple for companies in your industry\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;money;OTHER)",
              __typename: "Annotation",
              start: 154,
              end: 159,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "money",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    text: {
      __typename: "AnnotatedText",
      text:
        "At the end of the meeting Mathew Brennan asked what we thought we want to raise and I mentioned hiring a machine learning expert as well someone to build the react native or mobile application\n",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:9beb87fd-8984-4ac1-ba9c-34e13a9a9cbd",
        text: {
          __typename: "AnnotatedText",
          text:
            "Tangle can take advantage of the fact that a calendar contains all of the people that someone meets with. Their emails contain the people they communicate and collaborate with. Their shared documents show the people that they collaborate with. All these things together can create a graph where we can surface useful content for them #features\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;someone;PERSON)",
              __typename: "Annotation",
              start: 86,
              end: 93,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "someone",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:18e99390-4e42-4c33-a038-7cdc3d08c35c",
    text: {
      __typename: "AnnotatedText",
      text: "Mathew Brennan believes that we should focus on hiring a female\n",
      annotations: []
    },
    reasons: [],
    relatedItems: []
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    text: {
      __typename: "AnnotatedText",
      text:
        "Mathew Brennan thinks we should split our users into verticals by company or  industry and then by horizontal in terms of position at that company. This is a good way to segment our users\n",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:21c5ddaa-79d3-4128-9772-4bae6118f6c7",
        text: {
          __typename: "AnnotatedText",
          text:
            "According to Eugene Wei, falling into the trap of thinking other users will be like you is especially pernicious because the people building the product are usually among that early adopter cohort. The easiest north star for a product person is their own intuition. But if they're working on a product that requires customer segmentation, being in the early adopter cohort means one's instincts will keep guiding you towards the wrong North star and the company will just keep bumping into the invisible asymptote without any idea why. #growth\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 454,
              end: 461,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 454,
              end: 461,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
              __typename: "Annotation",
              start: 65,
              end: 70,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "users",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:6a4914ee-3c42-4334-ab22-72591dae5edd",
        text: {
          __typename: "AnnotatedText",
          text:
            "The role of COO is to address problems as they arise at the company. However the key to being a good COO is when addressing these problems and putting out the fires, putting in place processes and systems that prevent such fires or problems from systematically occurring in the future\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 60,
              end: 67,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 60,
              end: 67,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:b9363187-577b-4101-bb1b-4134269e6cc9",
        text: {
          __typename: "AnnotatedText",
          text:
            "One idea for addressing implicit bias is to have code of conduct. Establishing this early is key. All people that are brought on the company thus have set of shared expectations that they can point to understand how we hold each other accountable for our actions and how we intend to help each learn and grow as individuals and thus as a community #hiring\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 133,
              end: 140,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 133,
              end: 140,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:3cca38eb-a52e-4cb0-8a3c-e9ea86701286",
        text: {
          __typename: "AnnotatedText",
          text:
            "Fred Wilson believes that financing a company is more art and science. For a startup it is important not to overextend yourself. You do not want to raise money that places a valuation on your company that you cannot be reasonable expected to meet giving your growth, revenue, and the multiple for companies in your industry\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 38,
              end: 45,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 38,
              end: 45,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;industry;OTHER)",
              __typename: "Annotation",
              start: 315,
              end: 323,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 38,
              end: 45,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 38,
              end: 45,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "industry",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:39462449-030f-49aa-8fe4-72eef8884de6",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andy Santamaria worked with a consumer financial product competitor to Mint that was started by Goldman Sachs bankers. Ironically the name of their company was Tangle, but they eventually changed it. Although he received checks from them with Tangle on them\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 148,
              end: 155,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 148,
              end: 155,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:7a61a99b-8675-45cf-9bfb-2d944206aabc",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andy Santamaria is working with a QA company that focuses on diversity talent out of Harlem. It would be interesting to connect him with Randy Brown at Enrise\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 37,
              end: 44,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 37,
              end: 44,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:b3cf98bf-90ec-4edd-9fad-e8415f087fc4",
        text: {
          __typename: "AnnotatedText",
          text:
            "One of the main reasons people default into hiring from their network is that it easy to convince people to come work with you on risky project because there is some level of trust. It is hard to push outside of this and hire from elsewhere but this diversity of hiring people not like you can be a powerful moderating force in company. The challenge is does this push back on a startups ability to move quickly because the team is not necessarily operating from the same first principles #hiring\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 328,
              end: 335,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
              __typename: "Annotation",
              start: 328,
              end: 335,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "company",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:5d9a870a-15a0-48eb-92aa-b59a58b10662",
        text: {
          __typename: "AnnotatedText",
          text:
            "You can come to understand a powerful person by how they treat people less powerful than they are. These interactions reveal much about how that person views their position in the world and relationship to others\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;position;OTHER)",
              __typename: "Annotation",
              start: 164,
              end: 172,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "position",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:c5c09c27-5092-479f-860b-17055941c96d",
        text: {
          __typename: "AnnotatedText",
          text:
            "Charlie Kimble is currently interviewing with Circle for their Lead of Partnerships position",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;position;OTHER)",
              __typename: "Annotation",
              start: 84,
              end: 92,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "position",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:d64f436f-699e-4d86-8f0c-f801e170126d",
        text: {
          __typename: "AnnotatedText",
          text:
            "When performing a search in Tangle, we can treat the initial set of captures returned from the search service as the input to recommendation algorithms. This input then informs which of the related captures that we select to show the user, this way we can limit them to meaningful subset #ideas\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;way;OTHER)",
              __typename: "Annotation",
              start: 245,
              end: 248,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "way",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:ab97adf1-219a-432f-b3e4-dcda1a65ed37",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andy Santamaria thought that it was very important that we are able to provide and immediate aha moment or sense of value produced for the user. He thought that showing the user a visualization of all their imported data would be a powerful way to do this. #marketing\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;way;OTHER)",
              __typename: "Annotation",
              start: 241,
              end: 244,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "way",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:1721381c-4fcd-4ab4-8cf9-2d2f65b3da4b",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andy Santamaria thinks that we need to make sure we are generated as many metrics as possible from our application. We should also provide a way for the user to directly reach us in the app by using something like Intercom. You want to make your self as available as possible at all times. This includes making your emails all able to be responded to. Square had a situation where people were responding directly to automated text messages and they did not realize that this could be a source of feedback\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;way;OTHER)",
              __typename: "Annotation",
              start: 141,
              end: 144,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "way",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:499efccc-730a-4e4c-a623-a9d041d439f1",
        text: {
          __typename: "AnnotatedText",
          text:
            "According to Eugene Wei there's more than a whiff of Geoffrey Moore's Crossing the Chasm in this idea, some sense that moving from early adopters to the mainstream involves convincing more users to use the same product/service as early adopters do #growth\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
              __typename: "Annotation",
              start: 189,
              end: 194,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "users",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
        text: {
          __typename: "AnnotatedText",
          text:
            "We need to consider the implication of building a tool, Tangle, that enables users to pass down their data between generations. This makes the assumption that the data of the last generation should inform the next and that passing down more data is more useful than the natural data transfer that occurs now. These video is an internal video from Google that speaks to this future https://www.theverge.com/2018/5/17/17344250/google-x-selfish-ledger-video-data-privacy\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
              __typename: "Annotation",
              start: 77,
              end: 82,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "users",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:de009e47-c59c-4ad5-8739-6554e0183bfa",
    text: {
      __typename: "AnnotatedText",
      text:
        "Mathew Brennan believes that a Salesforce integration would have a clear ROI and also give use more structured data\n",
      annotations: []
    },
    reasons: [],
    relatedItems: [
      {
        __typename: "ListItem",
        id: "urn:hex:capture:6dc10cfa-ac9d-4aaa-bc14-eabe709d14a5",
        text: {
          __typename: "AnnotatedText",
          text:
            "The graph visualization may be the seduction that purely data driven algorithm recommending content cannot provide. This seduction is a powerful force and art #design\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
              __typename: "Annotation",
              start: 57,
              end: 61,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "data",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:c5602094-88ca-4750-8a58-18fd5f2cfa98",
        text: {
          __typename: "AnnotatedText",
          text:
            "Eugene Wei said this challenge isn't unique to Amazon. Tech companies in general have been mining the scalable ROI of machine learning and algorithms for many years now. More data, better recommendations, better matching of customer to goods, or so the story goes. But what I appreciate about luxury retail, or even Hollywood, is its skill for making you believe that something is the right thing for you, absent previous data. Seduction is a gift, and most people in technology vastly overestimate how much of customer happiness is solvable by data-driven algorithms while underestimating the ROI of seduction.\n\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
              __typename: "Annotation",
              start: 175,
              end: 179,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
              __typename: "Annotation",
              start: 175,
              end: 179,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;ROI;OTHER)",
              __typename: "Annotation",
              start: 111,
              end: 114,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;ROI;OTHER)",
              __typename: "Annotation",
              start: 111,
              end: 114,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "data",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "data",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "ROI",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "ROI",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
        text: {
          __typename: "AnnotatedText",
          text:
            "We need to consider the implication of building a tool, Tangle, that enables users to pass down their data between generations. This makes the assumption that the data of the last generation should inform the next and that passing down more data is more useful than the natural data transfer that occurs now. These video is an internal video from Google that speaks to this future https://www.theverge.com/2018/5/17/17344250/google-x-selfish-ledger-video-data-privacy\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
              __typename: "Annotation",
              start: 102,
              end: 106,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
              __typename: "Annotation",
              start: 102,
              end: 106,
              type: "HIGHLIGHT"
            },
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
              __typename: "Annotation",
              start: 102,
              end: 106,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "data",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "data",
            reasonType: "SHARES_ENTITY"
          },
          {
            __typename: "RecommendationReason",
            pivot: "data",
            reasonType: "SHARES_ENTITY"
          }
        ]
      },
      {
        __typename: "ListItem",
        id: "urn:hex:capture:ab97adf1-219a-432f-b3e4-dcda1a65ed37",
        text: {
          __typename: "AnnotatedText",
          text:
            "Andy Santamaria thought that it was very important that we are able to provide and immediate aha moment or sense of value produced for the user. He thought that showing the user a visualization of all their imported data would be a powerful way to do this. #marketing\n",
          annotations: [
            {
              linkToId:
                "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
              __typename: "Annotation",
              start: 216,
              end: 220,
              type: "HIGHLIGHT"
            }
          ]
        },
        reasons: [
          {
            __typename: "RecommendationReason",
            pivot: "data",
            reasonType: "SHARES_ENTITY"
          }
        ]
      }
    ]
  },
  {
    __typename: "ListItem",
    id: "urn:hex:capture:b63f6e59-f7b1-4af0-95af-6f4bad38b26f",
    text: {
      __typename: "AnnotatedText",
      text:
        "Information extraction is the process of analyzing text and identifying mentions of semantically defined entities and relationships within it\n",
      annotations: []
    },
    reasons: [],
    relatedItems: []
  }
] as Array<ListFieldsFragment>;

export const nodes = [
  {
    __typename: "Node",
    id: "urn:hex:capture:d08558ab-0c54-438d-b662-f8c92443f2e1",
    type: "Capture",
    text:
      "Syntax describes the structure of sentences. Morphology describes the structure of words\n",
    level: 0
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:de009e47-c59c-4ad5-8739-6554e0183bfa",
    type: "Capture",
    text:
      "Mathew Brennan believes that a Salesforce integration would have a clear ROI and also give use more structured data\n",
    level: 0
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    type: "Capture",
    text:
      "We noted that we had just read Brotopia and were thinking about how to avoid the pitfalls of bad culture associated with a lack of diversity\n",
    level: 0
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:18e99390-4e42-4c33-a038-7cdc3d08c35c",
    type: "Capture",
    text: "Mathew Brennan believes that we should focus on hiring a female\n",
    level: 0
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:b63f6e59-f7b1-4af0-95af-6f4bad38b26f",
    type: "Capture",
    text:
      "Information extraction is the process of analyzing text and identifying mentions of semantically defined entities and relationships within it\n",
    level: 0
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    type: "Capture",
    text:
      "We need to make sure in the future when we go into meetings with a VC that we have a clear ask even if that ask is not money. There should be action items on that come out of the meeting for both parties\n",
    level: 0
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    type: "Capture",
    text:
      "When we expose a public API for Tangle we could use this type of complexity metric in order to throttle queries\n\nhttps://blog.acolyer.org/2018/05/21/semantics-and-complexity-of-graphql/\n",
    level: 0
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    type: "Capture",
    text:
      "At the end of the meeting Mathew Brennan asked what we thought we want to raise and I mentioned hiring a machine learning expert as well someone to build the react native or mobile application\n",
    level: 0
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    type: "Capture",
    text:
      "Mathew Brennan thinks we should split our users into verticals by company or  industry and then by horizontal in terms of position at that company. This is a good way to segment our users\n",
    level: 0
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    type: "Capture",
    text:
      "Mathew Brennan believes that segmentation leads to valuable insights. Even if 99% of users do not like your product in the alpha release, the 1% that does could represent a large portion of the population as long as you understand who they are representative of. This is similar to Tim Ferris saying that if one person like a piece of content he produces he keeps it in because he believes they represent 10,000 others\n",
    level: 0
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;words;OTHER)",
    type: "Entity",
    text: "words",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;structure;OTHER)",
    type: "Entity",
    text: "structure",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Morphology;OTHER)",
    type: "Entity",
    text: "Morphology",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;sentences;OTHER)",
    type: "Entity",
    text: "sentences",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Syntax;OTHER)",
    type: "Entity",
    text: "Syntax",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
    type: "Entity",
    text: "data",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Salesforce;ORGANIZATION)",
    type: "Entity",
    text: "Salesforce",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;ROI;OTHER)",
    type: "Entity",
    text: "ROI",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;integration;OTHER)",
    type: "Entity",
    text: "integration",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Mathew Brennan;PERSON)",
    type: "Entity",
    text: "Mathew Brennan",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:session:402aced2-b750-49ec-9e8a-0a76624db702",
    type: "Session",
    text: "Meeting with Mathew Brennan",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;culture;OTHER)",
    type: "Entity",
    text: "culture",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;diversity;OTHER)",
    type: "Entity",
    text: "diversity",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;lack;OTHER)",
    type: "Entity",
    text: "lack",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Brotopia;PERSON)",
    type: "Entity",
    text: "Brotopia",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;pitfalls;OTHER)",
    type: "Entity",
    text: "pitfalls",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;female;PERSON)",
    type: "Entity",
    text: "female",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;entities;OTHER)",
    type: "Entity",
    text: "entities",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;relationships;OTHER)",
    type: "Entity",
    text: "relationships",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;mentions;OTHER)",
    type: "Entity",
    text: "mentions",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;text;OTHER)",
    type: "Entity",
    text: "text",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Information extraction;OTHER)",
    type: "Entity",
    text: "Information extraction",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;parties;ORGANIZATION)",
    type: "Entity",
    text: "parties",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;meeting;EVENT)",
    type: "Entity",
    text: "meeting",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;action items;OTHER)",
    type: "Entity",
    text: "action items",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;ask;OTHER)",
    type: "Entity",
    text: "ask",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;meetings;EVENT)",
    type: "Entity",
    text: "meetings",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;money;OTHER)",
    type: "Entity",
    text: "money",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;VC;OTHER)",
    type: "Entity",
    text: "VC",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;https://blog.acolyer.org/2018/05/21/semantics-and-complexity-of-graphql/;OTHER)",
    type: "Entity",
    text:
      "https://blog.acolyer.org/2018/05/21/semantics-and-complexity-of-graphql/",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;complexity metric;OTHER)",
    type: "Entity",
    text: "complexity metric",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;queries;OTHER)",
    type: "Entity",
    text: "queries",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;order;OTHER)",
    type: "Entity",
    text: "order",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;type;OTHER)",
    type: "Entity",
    text: "type",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "Entity",
    text: "Tangle",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;API;OTHER)",
    type: "Entity",
    text: "API",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:link:urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;https://blog.acolyer.org/2018/05/21/semantics-and-complexity-of-graphql/",
    type: "Link",
    text:
      "https://blog.acolyer.org/2018/05/21/semantics-and-complexity-of-graphql/",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;someone;PERSON)",
    type: "Entity",
    text: "someone",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;machine learning expert;PERSON)",
    type: "Entity",
    text: "machine learning expert",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;mobile application;OTHER)",
    type: "Entity",
    text: "mobile application",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;segment;OTHER)",
    type: "Entity",
    text: "segment",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "Entity",
    text: "company",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;position;OTHER)",
    type: "Entity",
    text: "position",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;terms;OTHER)",
    type: "Entity",
    text: "terms",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;industry;OTHER)",
    type: "Entity",
    text: "industry",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;verticals;OTHER)",
    type: "Entity",
    text: "verticals",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;way;OTHER)",
    type: "Entity",
    text: "way",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
    type: "Entity",
    text: "users",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tim Ferris;PERSON)",
    type: "Entity",
    text: "Tim Ferris",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
    type: "Entity",
    text: "others",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
    type: "Entity",
    text: "content",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;piece;OTHER)",
    type: "Entity",
    text: "piece",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;portion;OTHER)",
    type: "Entity",
    text: "portion",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;alpha release;WORK_OF_ART)",
    type: "Entity",
    text: "alpha release",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;population;PERSON)",
    type: "Entity",
    text: "population",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;person;PERSON)",
    type: "Entity",
    text: "person",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
    type: "Entity",
    text: "product",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;99%;OTHER)",
    type: "Entity",
    text: "99%",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;1%;OTHER)",
    type: "Entity",
    text: "1%",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;insights;OTHER)",
    type: "Entity",
    text: "insights",
    level: 1
  },
  {
    __typename: "Node",
    id:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;segmentation;OTHER)",
    type: "Entity",
    text: "segmentation",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:6dc10cfa-ac9d-4aaa-bc14-eabe709d14a5",
    type: "Capture",
    text:
      "The graph visualization may be the seduction that purely data driven algorithm recommending content cannot provide. This seduction is a powerful force and art #design\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:c5602094-88ca-4750-8a58-18fd5f2cfa98",
    type: "Capture",
    text:
      "Eugene Wei said this challenge isn't unique to Amazon. Tech companies in general have been mining the scalable ROI of machine learning and algorithms for many years now. More data, better recommendations, better matching of customer to goods, or so the story goes. But what I appreciate about luxury retail, or even Hollywood, is its skill for making you believe that something is the right thing for you, absent previous data. Seduction is a gift, and most people in technology vastly overestimate how much of customer happiness is solvable by data-driven algorithms while underestimating the ROI of seduction.\n\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
    type: "Capture",
    text:
      "We need to consider the implication of building a tool, Tangle, that enables users to pass down their data between generations. This makes the assumption that the data of the last generation should inform the next and that passing down more data is more useful than the natural data transfer that occurs now. These video is an internal video from Google that speaks to this future https://www.theverge.com/2018/5/17/17344250/google-x-selfish-ledger-video-data-privacy\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:ab97adf1-219a-432f-b3e4-dcda1a65ed37",
    type: "Capture",
    text:
      "Andy Santamaria thought that it was very important that we are able to provide and immediate aha moment or sense of value produced for the user. He thought that showing the user a visualization of all their imported data would be a powerful way to do this. #marketing\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:b3cf98bf-90ec-4edd-9fad-e8415f087fc4",
    type: "Capture",
    text:
      "One of the main reasons people default into hiring from their network is that it easy to convince people to come work with you on risky project because there is some level of trust. It is hard to push outside of this and hire from elsewhere but this diversity of hiring people not like you can be a powerful moderating force in company. The challenge is does this push back on a startups ability to move quickly because the team is not necessarily operating from the same first principles #hiring\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:5063f3b3-3cec-4e27-bd93-2f7756f3eea2",
    type: "Capture",
    text: "The book Brotopia was written by Emily Chang #hiring\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    type: "Capture",
    text:
      "Abram Dawson had the idea that we should seed a tangle with our biographies and background as well as information about who we are meeting with so that the demo contains information that will be familiar for all parties #pitch\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:ef66f833-fd97-4e11-a49d-e12b07ccc8fc",
    type: "Capture",
    text:
      "Joy Marcus is raising money primarily from government, especially New York, for her new fund. They are raising around 100 million dollars\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:3cca38eb-a52e-4cb0-8a3c-e9ea86701286",
    type: "Capture",
    text:
      "Fred Wilson believes that financing a company is more art and science. For a startup it is important not to overextend yourself. You do not want to raise money that places a valuation on your company that you cannot be reasonable expected to meet giving your growth, revenue, and the multiple for companies in your industry\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:365e7da3-2b91-4598-8a19-5a9d979aa581",
    type: "Capture",
    text:
      "In order to help with name disambiguation we could parse out full names into first name and last name nodes. We could then connect full names that contain these to each as well as captures that only contain either a first or last name. This will help make Tangle as a CRM #features\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:018823a4-d197-4d66-ac6a-69339c8009ad",
    type: "Capture",
    text: "More play leads to more open ended type of intelligence\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:42f3bbed-7037-473b-9394-c20f429738f9",
    type: "Capture",
    text:
      "Andy Santamaria told us a story about how the real niche user for Square was people who worked at farmers markets. These are the type of dedicated niche user we need to discover for Tangle #feedback\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:5afc3e10-61a3-4808-bc6d-61a605ba9f9d",
    type: "Capture",
    text:
      "I imagined our Tangle retail spaces where we would allow people to come and site in lounge areas and allow their tangles to interact with other patrons tangles. This could allow for them to spark natural conversations on topics that they have both thought about. These retail spaces could become a new type of cafe or the modern philosophers cafe like in Paris during the Enlightenment #meditation\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:d64f436f-699e-4d86-8f0c-f801e170126d",
    type: "Capture",
    text:
      "When performing a search in Tangle, we can treat the initial set of captures returned from the search service as the input to recommendation algorithms. This input then informs which of the related captures that we select to show the user, this way we can limit them to meaningful subset #ideas\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:b8664cee-4f10-4bf9-87cb-bd92c30bee81",
    type: "Capture",
    text:
      "Games, songs, and situations where they are not too repetitive and there is a sense of surprise are the ones that are most enjoyed. Tangle can make knowledge management surprising and engaging by surfacing your old thoughts that you have forgotten about. These surprise seeking behavior that can be facilitated with connection is interesting to explore \n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:741f2833-c20d-45c4-96a6-dcf53daf1be5",
    type: "Capture",
    text:
      "There is a strong relationship between play, delight and curiosity. People become fascinated with things for the sheer intrigue and this create a strong sense of exploration and discovery. This is something that we could design Tangle to give people\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:ac0c3631-1e5b-4893-a6af-8c2b5521bccf",
    type: "Capture",
    text:
      "This raises the question of how you make wonder and delight a central part of the product you produce. I think that Tangle can do this for knowledge management\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:3389d2cf-2b14-48b7-8e3b-139454c3d93d",
    type: "Capture",
    text:
      "We could reframe the branding and marketing of Tangle around making note taking and knowledge management fun #marketing #branding\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:39462449-030f-49aa-8fe4-72eef8884de6",
    type: "Capture",
    text:
      "Andy Santamaria worked with a consumer financial product competitor to Mint that was started by Goldman Sachs bankers. Ironically the name of their company was Tangle, but they eventually changed it. Although he received checks from them with Tangle on them\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:9beb87fd-8984-4ac1-ba9c-34e13a9a9cbd",
    type: "Capture",
    text:
      "Tangle can take advantage of the fact that a calendar contains all of the people that someone meets with. Their emails contain the people they communicate and collaborate with. Their shared documents show the people that they collaborate with. All these things together can create a graph where we can surface useful content for them #features\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:2452cd34-4990-476c-b31e-faa9c7c40562",
    type: "Capture",
    text:
      "Tangle and Tangle Teams in particular can help to develop what has come to be known as the workplace graph. Slack, Dropbox and others are working in this space as well\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
    type: "Capture",
    text: "David Dohan recommended using Spacy for our NLP library for Tangle",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:91d47176-f275-4f91-a480-859c9b406cbb",
    type: "Capture",
    text: "Will Minshew is our first advisor on Tangle\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:21c5ddaa-79d3-4128-9772-4bae6118f6c7",
    type: "Capture",
    text:
      "According to Eugene Wei, falling into the trap of thinking other users will be like you is especially pernicious because the people building the product are usually among that early adopter cohort. The easiest north star for a product person is their own intuition. But if they're working on a product that requires customer segmentation, being in the early adopter cohort means one's instincts will keep guiding you towards the wrong North star and the company will just keep bumping into the invisible asymptote without any idea why. #growth\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:6a4914ee-3c42-4334-ab22-72591dae5edd",
    type: "Capture",
    text:
      "The role of COO is to address problems as they arise at the company. However the key to being a good COO is when addressing these problems and putting out the fires, putting in place processes and systems that prevent such fires or problems from systematically occurring in the future\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:b9363187-577b-4101-bb1b-4134269e6cc9",
    type: "Capture",
    text:
      "One idea for addressing implicit bias is to have code of conduct. Establishing this early is key. All people that are brought on the company thus have set of shared expectations that they can point to understand how we hold each other accountable for our actions and how we intend to help each learn and grow as individuals and thus as a community #hiring\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:7a61a99b-8675-45cf-9bfb-2d944206aabc",
    type: "Capture",
    text:
      "Andy Santamaria is working with a QA company that focuses on diversity talent out of Harlem. It would be interesting to connect him with Randy Brown at Enrise\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:5d9a870a-15a0-48eb-92aa-b59a58b10662",
    type: "Capture",
    text:
      "You can come to understand a powerful person by how they treat people less powerful than they are. These interactions reveal much about how that person views their position in the world and relationship to others\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:c5c09c27-5092-479f-860b-17055941c96d",
    type: "Capture",
    text:
      "Charlie Kimble is currently interviewing with Circle for their Lead of Partnerships position",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:1721381c-4fcd-4ab4-8cf9-2d2f65b3da4b",
    type: "Capture",
    text:
      "Andy Santamaria thinks that we need to make sure we are generated as many metrics as possible from our application. We should also provide a way for the user to directly reach us in the app by using something like Intercom. You want to make your self as available as possible at all times. This includes making your emails all able to be responded to. Square had a situation where people were responding directly to automated text messages and they did not realize that this could be a source of feedback\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:499efccc-730a-4e4c-a623-a9d041d439f1",
    type: "Capture",
    text:
      "According to Eugene Wei there's more than a whiff of Geoffrey Moore's Crossing the Chasm in this idea, some sense that moving from early adopters to the mainstream involves convincing more users to use the same product/service as early adopters do #growth\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:eac6c020-acf5-45f2-a1fa-3f14d4f216f8",
    type: "Capture",
    text:
      "Abram Dawson offered to introduce us to his friend Justin Mars who he described as Tim Ferris \n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:4b35182c-a08a-4df5-bd04-283bed4e7f67",
    type: "Capture",
    text:
      "Jeremy Pressman wants to start an equity share with friends where they participate in the upside of each others lives by sharing equity positions with one another. In this way networks of people can pursue higher risk paths because their success is diversified against the group as whole. This works as long as there is not a free loader problem.\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:a8d17eaf-e716-480b-a358-b23f0c44e577",
    type: "Capture",
    text:
      "A bar allows people to experiment with new identities and ways of interacting with others that allow new movements to take place \n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:ca7db5e0-f56d-41f4-8701-c7603a8699e0",
    type: "Capture",
    text:
      "Peter Drucker discusses the importance of having a defining purpose in life. this purpose gives you the framework for making decisions. Without you can always just actions that are bad for others as okay for you because you will do it just this once. The marginal cost is not that high.\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:db1fe871-d471-4dca-92b3-1c61acdfc437",
    type: "Capture",
    text:
      "Joy Marcus thought that Tangle did not need the graph visualization but that removing the need to organize and surfacing content automatically was interesting #feedback\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:cba29c4c-304f-44f9-9137-e3fddf2500a5",
    type: "Capture",
    text:
      "Fake news, and related expressions of the same, such as alternative facts, is related to gaming or misusing the underlying greedy algorithm. The result is an increase in the spread of mostly promoted and highly opinionated content\n\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:620a4d53-1e9e-4aab-94e2-82e76e682e37",
    type: "Capture",
    text:
      "Filter bubbles are the result of engagement-based content filtering. The underlying principle is to show the user content that relates to the content the user has previously engaged on. The result is a content stream that lacks diversification of topics and opinions.\n\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:2b2fe4f6-bb18-416b-babe-3756eab069fa",
    type: "Capture",
    text:
      "Andrew Chen said that the most underrated growth tactic for a SAAS is that a product should be fun. This often gets lost in all the fuss about metrics #marketing\n",
    level: 1
  },
  {
    __typename: "Node",
    id: "urn:hex:capture:6fdf7235-7ef1-4e4a-846a-2f3cef4ebf28",
    type: "Capture",
    text:
      "Andy Santamaria think that right now our product is so general and is doing so many things that it is hard to focus on a particular ideal consumer. He is partially excited to work with us because he can help us hone the core consumer and design the product to really meet their needs\n",
    level: 1
  }
] as Array<NodeFieldsFragment>;

export const edges = [
  {
    __typename: "Edge",
    source: "urn:hex:capture:d08558ab-0c54-438d-b662-f8c92443f2e1",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;words;OTHER)",
    type: "REFERENCES",
    salience: 0.03485996276140213
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:d08558ab-0c54-438d-b662-f8c92443f2e1",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;structure;OTHER)",
    type: "REFERENCES",
    salience: 0.06629595160484314
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:d08558ab-0c54-438d-b662-f8c92443f2e1",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Morphology;OTHER)",
    type: "REFERENCES",
    salience: 0.09279018640518188
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:d08558ab-0c54-438d-b662-f8c92443f2e1",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;sentences;OTHER)",
    type: "REFERENCES",
    salience: 0.14191056787967682
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:d08558ab-0c54-438d-b662-f8c92443f2e1",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;structure;OTHER)",
    type: "REFERENCES",
    salience: 0.26232025027275085
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:d08558ab-0c54-438d-b662-f8c92443f2e1",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Syntax;OTHER)",
    type: "REFERENCES",
    salience: 0.4018230736255646
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de009e47-c59c-4ad5-8739-6554e0183bfa",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
    type: "REFERENCES",
    salience: 0.09278076887130737
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de009e47-c59c-4ad5-8739-6554e0183bfa",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Salesforce;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.1440085917711258
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de009e47-c59c-4ad5-8739-6554e0183bfa",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;ROI;OTHER)",
    type: "REFERENCES",
    salience: 0.2173820585012436
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de009e47-c59c-4ad5-8739-6554e0183bfa",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;integration;OTHER)",
    type: "REFERENCES",
    salience: 0.22745712101459503
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de009e47-c59c-4ad5-8739-6554e0183bfa",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Mathew Brennan;PERSON)",
    type: "REFERENCES",
    salience: 0.3183714747428894
  },
  {
    __typename: "Edge",
    source: "urn:hex:session:402aced2-b750-49ec-9e8a-0a76624db702",
    destination: "urn:hex:capture:de009e47-c59c-4ad5-8739-6554e0183bfa",
    type: "INCLUDES",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    type: "PREVIOUS",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;culture;OTHER)",
    type: "REFERENCES",
    salience: 0.10602046549320221
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;diversity;OTHER)",
    type: "REFERENCES",
    salience: 0.167278453707695
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;lack;OTHER)",
    type: "REFERENCES",
    salience: 0.167278453707695
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Brotopia;PERSON)",
    type: "REFERENCES",
    salience: 0.250890851020813
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;pitfalls;OTHER)",
    type: "REFERENCES",
    salience: 0.308531790971756
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    destination: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    type: "PREVIOUS",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:session:402aced2-b750-49ec-9e8a-0a76624db702",
    destination: "urn:hex:capture:de642bc5-790e-49a6-bdf0-5396cb2a38d0",
    type: "INCLUDES",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    destination: "urn:hex:capture:18e99390-4e42-4c33-a038-7cdc3d08c35c",
    type: "PREVIOUS",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:18e99390-4e42-4c33-a038-7cdc3d08c35c",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;female;PERSON)",
    type: "REFERENCES",
    salience: 0.28222429752349854
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:18e99390-4e42-4c33-a038-7cdc3d08c35c",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Mathew Brennan;PERSON)",
    type: "REFERENCES",
    salience: 0.7177757024765015
  },
  {
    __typename: "Edge",
    source: "urn:hex:session:402aced2-b750-49ec-9e8a-0a76624db702",
    destination: "urn:hex:capture:18e99390-4e42-4c33-a038-7cdc3d08c35c",
    type: "INCLUDES",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:b63f6e59-f7b1-4af0-95af-6f4bad38b26f",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;entities;OTHER)",
    type: "REFERENCES",
    salience: 0.02523992396891117
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:b63f6e59-f7b1-4af0-95af-6f4bad38b26f",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;relationships;OTHER)",
    type: "REFERENCES",
    salience: 0.05614874139428139
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:b63f6e59-f7b1-4af0-95af-6f4bad38b26f",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;mentions;OTHER)",
    type: "REFERENCES",
    salience: 0.07345109432935715
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:b63f6e59-f7b1-4af0-95af-6f4bad38b26f",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;text;OTHER)",
    type: "REFERENCES",
    salience: 0.07872819900512695
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:b63f6e59-f7b1-4af0-95af-6f4bad38b26f",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Information extraction;OTHER)",
    type: "REFERENCES",
    salience: 0.7664320468902588
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;parties;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.029794134199619293
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;meeting;EVENT)",
    type: "REFERENCES",
    salience: 0.033888719975948334
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;action items;OTHER)",
    type: "REFERENCES",
    salience: 0.05546184256672859
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;ask;OTHER)",
    type: "REFERENCES",
    salience: 0.1403486728668213
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;meetings;EVENT)",
    type: "REFERENCES",
    salience: 0.1403486728668213
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;money;OTHER)",
    type: "REFERENCES",
    salience: 0.14622068405151367
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;ask;OTHER)",
    type: "REFERENCES",
    salience: 0.15612657368183136
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;VC;OTHER)",
    type: "REFERENCES",
    salience: 0.29781070351600647
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    destination: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    type: "PREVIOUS",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:session:402aced2-b750-49ec-9e8a-0a76624db702",
    destination: "urn:hex:capture:844cc436-04b9-432f-92a1-79496ba2f6e9",
    type: "INCLUDES",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;https://blog.acolyer.org/2018/05/21/semantics-and-complexity-of-graphql/;OTHER)",
    type: "REFERENCES",
    salience: 0.02865566872060299
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;complexity metric;OTHER)",
    type: "REFERENCES",
    salience: 0.06281750649213791
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;queries;OTHER)",
    type: "REFERENCES",
    salience: 0.09936997294425964
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;order;OTHER)",
    type: "REFERENCES",
    salience: 0.14051374793052673
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;type;OTHER)",
    type: "REFERENCES",
    salience: 0.18438200652599335
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.19781561195850372
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;API;OTHER)",
    type: "REFERENCES",
    salience: 0.2864454686641693
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:8039ea5b-7c2a-4ee2-aec8-ba7eb315f2bd",
    destination:
      "urn:hex:link:urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;https://blog.acolyer.org/2018/05/21/semantics-and-complexity-of-graphql/",
    type: "LINKS_TO",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;someone;PERSON)",
    type: "REFERENCES",
    salience: 0.09528541564941406
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;machine learning expert;PERSON)",
    type: "REFERENCES",
    salience: 0.09528541564941406
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;mobile application;OTHER)",
    type: "REFERENCES",
    salience: 0.1507304310798645
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Mathew Brennan;PERSON)",
    type: "REFERENCES",
    salience: 0.2242007702589035
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;meeting;EVENT)",
    type: "REFERENCES",
    salience: 0.4344979524612427
  },
  {
    __typename: "Edge",
    source: "urn:hex:session:402aced2-b750-49ec-9e8a-0a76624db702",
    destination: "urn:hex:capture:7e8d3d79-ffd8-4837-b46c-23f99bb4afbb",
    type: "INCLUDES",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;segment;OTHER)",
    type: "REFERENCES",
    salience: 0.01329046580940485
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.019698960706591606
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;position;OTHER)",
    type: "REFERENCES",
    salience: 0.0514954999089241
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;terms;OTHER)",
    type: "REFERENCES",
    salience: 0.0514954999089241
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;industry;OTHER)",
    type: "REFERENCES",
    salience: 0.05532541126012802
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;verticals;OTHER)",
    type: "REFERENCES",
    salience: 0.05532541126012802
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.06273248046636581
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;way;OTHER)",
    type: "REFERENCES",
    salience: 0.09810791164636612
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Mathew Brennan;PERSON)",
    type: "REFERENCES",
    salience: 0.12910372018814087
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ebc0ee6a-6692-4e7b-b030-3060e3ddefc8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
    type: "REFERENCES",
    salience: 0.4634246230125427
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tim Ferris;PERSON)",
    type: "REFERENCES",
    salience: 0.005348274018615484
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
    type: "REFERENCES",
    salience: 0.012144949287176132
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
    type: "REFERENCES",
    salience: 0.02057735063135624
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;piece;OTHER)",
    type: "REFERENCES",
    salience: 0.02057735063135624
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;portion;OTHER)",
    type: "REFERENCES",
    salience: 0.025152824819087982
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;alpha release;WORK_OF_ART)",
    type: "REFERENCES",
    salience: 0.029484611004590988
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;population;PERSON)",
    type: "REFERENCES",
    salience: 0.02984696254134178
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;person;PERSON)",
    type: "REFERENCES",
    salience: 0.03059694543480873
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
    type: "REFERENCES",
    salience: 0.032510023564100266
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;99%;OTHER)",
    type: "REFERENCES",
    salience: 0.03312762454152107
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
    type: "REFERENCES",
    salience: 0.043554771691560745
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Mathew Brennan;PERSON)",
    type: "REFERENCES",
    salience: 0.08469897508621216
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;1%;OTHER)",
    type: "REFERENCES",
    salience: 0.16065235435962677
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;insights;OTHER)",
    type: "REFERENCES",
    salience: 0.2277328073978424
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;segmentation;OTHER)",
    type: "REFERENCES",
    salience: 0.24399417638778687
  },
  {
    __typename: "Edge",
    source: "urn:hex:session:402aced2-b750-49ec-9e8a-0a76624db702",
    destination: "urn:hex:capture:58f692c9-4880-42c0-a320-efb4eac8446b",
    type: "INCLUDES",
    salience: null
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:6dc10cfa-ac9d-4aaa-bc14-eabe709d14a5",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
    type: "REFERENCES",
    salience: 0.05580022558569908
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:c5602094-88ca-4750-8a58-18fd5f2cfa98",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
    type: "REFERENCES",
    salience: 0.006713492795825005
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:c5602094-88ca-4750-8a58-18fd5f2cfa98",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
    type: "REFERENCES",
    salience: 0.021862559020519257
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
    type: "REFERENCES",
    salience: 0.023971499875187874
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
    type: "REFERENCES",
    salience: 0.02426418662071228
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
    type: "REFERENCES",
    salience: 0.05287433788180351
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ab97adf1-219a-432f-b3e4-dcda1a65ed37",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;data;OTHER)",
    type: "REFERENCES",
    salience: 0.0334947444498539
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:c5602094-88ca-4750-8a58-18fd5f2cfa98",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;ROI;OTHER)",
    type: "REFERENCES",
    salience: 0.009739995934069157
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:c5602094-88ca-4750-8a58-18fd5f2cfa98",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;ROI;OTHER)",
    type: "REFERENCES",
    salience: 0.02963683381676674
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:b3cf98bf-90ec-4edd-9fad-e8415f087fc4",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;diversity;OTHER)",
    type: "REFERENCES",
    salience: 0.012874096632003784
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:5063f3b3-3cec-4e27-bd93-2f7756f3eea2",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Brotopia;PERSON)",
    type: "REFERENCES",
    salience: 0.18184120953083038
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:31d6d119-29a4-499d-a351-976f488af762",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;parties;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.03687840700149536
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ef66f833-fd97-4e11-a49d-e12b07ccc8fc",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;money;OTHER)",
    type: "REFERENCES",
    salience: 0.16172152757644653
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:3cca38eb-a52e-4cb0-8a3c-e9ea86701286",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;money;OTHER)",
    type: "REFERENCES",
    salience: 0.06970151513814926
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:365e7da3-2b91-4598-8a19-5a9d979aa581",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;order;OTHER)",
    type: "REFERENCES",
    salience: 0.10152430087327957
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:018823a4-d197-4d66-ac6a-69339c8009ad",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;type;OTHER)",
    type: "REFERENCES",
    salience: 0.08721383661031723
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:42f3bbed-7037-473b-9394-c20f429738f9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;type;OTHER)",
    type: "REFERENCES",
    salience: 0.020000610500574112
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:5afc3e10-61a3-4808-bc6d-61a605ba9f9d",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;type;OTHER)",
    type: "REFERENCES",
    salience: 0.011943517252802849
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:d64f436f-699e-4d86-8f0c-f801e170126d",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.18533369898796082
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.39886632561683655
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:b8664cee-4f10-4bf9-87cb-bd92c30bee81",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.015559829771518707
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:741f2833-c20d-45c4-96a6-dcf53daf1be5",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.017710082232952118
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ac0c3631-1e5b-4893-a6af-8c2b5521bccf",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.0504935197532177
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:3389d2cf-2b14-48b7-8e3b-139454c3d93d",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.24179095029830933
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:42f3bbed-7037-473b-9394-c20f429738f9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.025230105966329575
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:39462449-030f-49aa-8fe4-72eef8884de6",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.011413631029427052
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:9beb87fd-8984-4ac1-ba9c-34e13a9a9cbd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.17430388927459717
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:2452cd34-4990-476c-b31e-faa9c7c40562",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.42066532373428345
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:a6fe28ad-19b9-4a45-b441-21fc3b0e5fb6",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.13940460979938507
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:91d47176-f275-4f91-a480-859c9b406cbb",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tangle;OTHER)",
    type: "REFERENCES",
    salience: 0.14625893533229828
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:9beb87fd-8984-4ac1-ba9c-34e13a9a9cbd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;someone;PERSON)",
    type: "REFERENCES",
    salience: 0.08622793853282928
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:21c5ddaa-79d3-4128-9772-4bae6118f6c7",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.011667665094137192
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:6a4914ee-3c42-4334-ab22-72591dae5edd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.06805434077978134
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:b9363187-577b-4101-bb1b-4134269e6cc9",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.03345142677426338
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:3cca38eb-a52e-4cb0-8a3c-e9ea86701286",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.04180202633142471
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:3cca38eb-a52e-4cb0-8a3c-e9ea86701286",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.33831214904785156
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:39462449-030f-49aa-8fe4-72eef8884de6",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.04370436072349548
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:7a61a99b-8675-45cf-9bfb-2d944206aabc",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.31505444645881653
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:b3cf98bf-90ec-4edd-9fad-e8415f087fc4",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;company;ORGANIZATION)",
    type: "REFERENCES",
    salience: 0.00427175872027874
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:5d9a870a-15a0-48eb-92aa-b59a58b10662",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;position;OTHER)",
    type: "REFERENCES",
    salience: 0.027294734492897987
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:c5c09c27-5092-479f-860b-17055941c96d",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;position;OTHER)",
    type: "REFERENCES",
    salience: 0.15006855130195618
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:3cca38eb-a52e-4cb0-8a3c-e9ea86701286",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;industry;OTHER)",
    type: "REFERENCES",
    salience: 0.017767982557415962
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:d64f436f-699e-4d86-8f0c-f801e170126d",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;way;OTHER)",
    type: "REFERENCES",
    salience: 0.017298610880970955
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ab97adf1-219a-432f-b3e4-dcda1a65ed37",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;way;OTHER)",
    type: "REFERENCES",
    salience: 0.028936654329299927
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:1721381c-4fcd-4ab4-8cf9-2d2f65b3da4b",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;way;OTHER)",
    type: "REFERENCES",
    salience: 0.036203522235155106
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:21c5ddaa-79d3-4128-9772-4bae6118f6c7",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
    type: "REFERENCES",
    salience: 0.061671290546655655
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:499efccc-730a-4e4c-a623-a9d041d439f1",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
    type: "REFERENCES",
    salience: 0.03189548850059509
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:462120d4-7fec-4a1b-95df-40b361eae290",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;users;PERSON)",
    type: "REFERENCES",
    salience: 0.1595892608165741
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:eac6c020-acf5-45f2-a1fa-3f14d4f216f8",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;Tim Ferris;PERSON)",
    type: "REFERENCES",
    salience: 0.016101710498332977
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:5d9a870a-15a0-48eb-92aa-b59a58b10662",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
    type: "REFERENCES",
    salience: 0.019165242090821266
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:4b35182c-a08a-4df5-bd04-283bed4e7f67",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
    type: "REFERENCES",
    salience: 0.06893640756607056
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:a8d17eaf-e716-480b-a358-b23f0c44e577",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
    type: "REFERENCES",
    salience: 0.029946940019726753
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:2452cd34-4990-476c-b31e-faa9c7c40562",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
    type: "REFERENCES",
    salience: 0.03916805610060692
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ca7db5e0-f56d-41f4-8701-c7603a8699e0",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;others;PERSON)",
    type: "REFERENCES",
    salience: 0.021744010969996452
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:6dc10cfa-ac9d-4aaa-bc14-eabe709d14a5",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
    type: "REFERENCES",
    salience: 0.05020913854241371
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:db1fe871-d471-4dca-92b3-1c61acdfc437",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
    type: "REFERENCES",
    salience: 0.1296578347682953
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:9beb87fd-8984-4ac1-ba9c-34e13a9a9cbd",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
    type: "REFERENCES",
    salience: 0.00777908181771636
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:cba29c4c-304f-44f9-9137-e3fddf2500a5",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
    type: "REFERENCES",
    salience: 0.019153865054249763
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:620a4d53-1e9e-4aab-94e2-82e76e682e37",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;content;OTHER)",
    type: "REFERENCES",
    salience: 0.03353999927639961
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:5d9a870a-15a0-48eb-92aa-b59a58b10662",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;person;PERSON)",
    type: "REFERENCES",
    salience: 0.5109702944755554
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:21c5ddaa-79d3-4128-9772-4bae6118f6c7",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
    type: "REFERENCES",
    salience: 0.08607109636068344
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:21c5ddaa-79d3-4128-9772-4bae6118f6c7",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
    type: "REFERENCES",
    salience: 0.10774270445108414
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:499efccc-730a-4e4c-a623-a9d041d439f1",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
    type: "REFERENCES",
    salience: 0.07160477340221405
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:ac0c3631-1e5b-4893-a6af-8c2b5521bccf",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
    type: "REFERENCES",
    salience: 0.1363905519247055
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:2b2fe4f6-bb18-416b-babe-3756eab069fa",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
    type: "REFERENCES",
    salience: 0.2077140212059021
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:6fdf7235-7ef1-4e4a-846a-2f3cef4ebf28",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
    type: "REFERENCES",
    salience: 0.016583364456892014
  },
  {
    __typename: "Edge",
    source: "urn:hex:capture:6fdf7235-7ef1-4e4a-846a-2f3cef4ebf28",
    destination:
      "urn:hex:entity:(urn:hex:user:X4MCFS8VrmVN8GoWanIPo5tUfNy1;product;CONSUMER_GOOD)",
    type: "REFERENCES",
    salience: 0.11953824013471603
  }
] as Array<EdgeFieldsFragment>;
