import React, { Component } from "react";
import Helmet from "react-helmet";

import { ChevronRight } from "react-feather";
import Alpha from "../components/Subscribe/Alpha";
import Graph from "../components/Graph/Graph";
import config from "../../data/SiteConfig";

class Home extends Component {
  render() {
    return (
      <div className={`dt w-90 center`}>
        <Helmet title={config.siteTitle} />

        {/* Header */}
        <div className={`dt-row vh-50 w-100`}>
          <div className={`h-100 w-100`}>
            <div
              className={`w-50-l w-100 fr pa2 mt4-l br4 shadow-1`}
              style={{ pointerEvents: "none" }}
            >
              <div style={{ padding: "54.09% 0 0 0", position: "relative" }}>
                <iframe
                  src={`https://player.vimeo.com/video/267437570?background=1&autoplay=1&loop=1&title=0&byline=0&portrait=0`}
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white"
                  }}
                  frameBorder="0"
                />
              </div>
              <script src="https://player.vimeo.com/api/player.js" />
            </div>
            <div className={`w-50-l w-100 fl pt4`}>
              <div className={`measure mt4-l mr4-l`}>
                <div className={`f3 lh-copy dark-gray fw4 pb4`}>
                  Connect your dots.
                </div>
                <div className={`f3 lh-copy gray fw1 pb4`}>
                  It's hard to know everything you know. Effortlessly surface
                  the connections between your thoughts with the power of
                  Tangle.
                </div>
                <div className={`dt pb5`}>
                  <a href={`http://eepurl.com/dtlCKD`} className={`link`}>
                    <div className={`dtc`}>
                      <span
                        className={`f4 lh-copy dark-gray b bb bw1 pointer b--accent`}
                      >
                        Get early access
                      </span>
                    </div>
                    <div className={`dtc v-mid`}>
                      <ChevronRight />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What is it */}
        <div className={`dt-row w-100`}>
          <div className={`w-100 pt6-l pt4`}>
            <div className={`measure-wide center`}>
              <div className={`ttu accent lh-copy pb4`}>what is it?</div>
              <div className={`f4 fw2 gray lh-copy`}>
                Tangle is your personal knowledge graph. Capture your thoughts,
                jot down ideas, and import your notes from your favorite service
                without worrying about how to organize them. Easily surface
                useful connections between what you know when you build your
                tangle.
              </div>
            </div>
          </div>
        </div>

        {/* Feature 1 */}
        <div className={`dt-row w-100`}>
          <div className={`dt w-100 mt6-l pv4 mt5 ba br4 b--light-gray`}>
            <div className={`dt-row dtc-l v-mid w-100 w-50-l`}>
              <div className={`f3 measure-narrow lh-copy pa4 fr-l mv6-l`}>
                <div className={`f3 dark-gray fw4 pb4`}>
                  Stop organizing notes.
                </div>
                <div className={`f4 gray fw2`}>
                  Spend more time capturing thoughts and less time organizing
                  them.
                </div>
              </div>
            </div>
            <div className={`dt-row dtc-l v-mid w-100 w-50-l`}>
              <div
                className={`dt center h5 shadow-1 ba br4 b--light-gray bg-white`}
                style={{
                  minWidth: "17.5em"
                }}
              >
                <div className={`h-100 w-100 pa4`}>
                  <div
                    className={`relative dt h-100 w-100 bb bw1 b--accent`}
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      className={`absolute top-0 right-0 bb bw1 b--accent`}
                      style={{ minWidth: "1.5rem" }}
                    />
                    <div className={`dtc pb2 f6 gray v-btm h-100 i`}>
                      What's on your mind?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steve Jobs */}
        <div className={`dt-row w-100`}>
          <div className={`w-100 pt6-l pt4`}>
            <div className={`measure-wide center`}>
              <div className={`f4 fw2 gray lh-copy pb4`}>
                Creativity is just connecting things. When you ask creative
                people how they did something, they feel a little guilty because
                they didn’t really do it, they just saw something. It seemed
                obvious to them after a while. That’s because they were able to
                connect experiences they’ve had and synthesize new things.
              </div>
              <div className={`fr ttu accent lh-copy`}>- steve jobs</div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className={`dt-row w-100`}>
          <div className={`dt h-100 w-100 mt6-l mt5 ba br4 b--light-gray`}>
            <div className={`dtc-l dt-row w-50 h-100`}>
              <div
                className={`pa1 pa4-l w-100 h-100-l h5`}
                style={{
                  pointerEvents: "none"
                }}
              >
                <Graph
                  nodeData={[
                    {
                      id:
                        "urn:hex:capture:efea42bb-04bf-4c6b-96ed-44129aa90b2e",
                      name: "Tangle would have been used by Steve Jobs",
                      category: "detail"
                    },
                    {
                      id: "urn:hex:entity:Steve Jobs;PERSON",
                      name: "Steve Jobs",
                      category: "entity"
                    },
                    {
                      id: "urn:hex:entity:Tangle;OTHER",
                      name: "Tangle",
                      category: "entity"
                    },
                    {
                      id:
                        "urn:hex:capture:8e43c9ed-3d1f-47e6-a907-c9a9629c1694",
                      name:
                        "Tangle would have been used by Albert Einstein and Steve Jobs",
                      category: "detail"
                    },
                    {
                      id:
                        "urn:hex:capture:63878d7a-7871-4c0d-8137-de7229624447",
                      name: "What would Steve Jobs say to Albert Einstein",
                      category: "blur"
                    },
                    {
                      id:
                        "urn:hex:capture:e92e5fa1-8624-4986-8eaa-7486e126e14a",
                      name: "Tangle gives everyone the power of connection\n",
                      category: "detail"
                    },
                    {
                      id:
                        "urn:hex:capture:29745222-d446-4046-be18-afaa86d92a02",
                      name: "Tangle automatically connects your thoughts",
                      category: "detail"
                    },
                    {
                      id: "urn:hex:entity:connection;OTHER",
                      name: "connection",
                      category: "entity"
                    },
                    {
                      id: "urn:hex:entity:power;OTHER",
                      name: "power",
                      category: "entity"
                    },
                    {
                      id: "urn:hex:entity:everyone;PERSON",
                      name: "everyone",
                      category: "entity"
                    },
                    {
                      id:
                        "urn:hex:capture:ad419354-dfc3-4703-87c8-083c78e6d1c1",
                      name:
                        "It can even find connection to people, like Albert Einstein\n",
                      category: "blur"
                    },
                    {
                      id: "urn:hex:entity:Albert Einstein;PERSON",
                      name: "Albert Einstein",
                      category: "entity"
                    },
                    {
                      id:
                        "urn:hex:capture:89e5d7ba-badd-4d10-a3b3-451ab6a94cf9",
                      name: "Albert Einstein loved physics\n",
                      category: "blur"
                    },
                    {
                      id: "urn:hex:entity:thoughts;OTHER",
                      name: "thoughts",
                      category: "entity"
                    }
                  ]}
                  edgeData={[
                    {
                      source:
                        "urn:hex:capture:efea42bb-04bf-4c6b-96ed-44129aa90b2e",
                      destination: "urn:hex:entity:Steve Jobs;PERSON"
                    },
                    {
                      source:
                        "urn:hex:capture:efea42bb-04bf-4c6b-96ed-44129aa90b2e",
                      destination: "urn:hex:entity:Tangle;OTHER"
                    },
                    {
                      source:
                        "urn:hex:capture:8e43c9ed-3d1f-47e6-a907-c9a9629c1694",
                      destination: "urn:hex:entity:Steve Jobs;PERSON"
                    },
                    {
                      source:
                        "urn:hex:capture:63878d7a-7871-4c0d-8137-de7229624447",
                      destination: "urn:hex:entity:Steve Jobs;PERSON"
                    },
                    {
                      source:
                        "urn:hex:capture:8e43c9ed-3d1f-47e6-a907-c9a9629c1694",
                      destination: "urn:hex:entity:Tangle;OTHER"
                    },
                    {
                      source:
                        "urn:hex:capture:e92e5fa1-8624-4986-8eaa-7486e126e14a",
                      destination: "urn:hex:entity:Tangle;OTHER"
                    },
                    {
                      source:
                        "urn:hex:capture:29745222-d446-4046-be18-afaa86d92a02",
                      destination: "urn:hex:entity:Tangle;OTHER"
                    },
                    {
                      source:
                        "urn:hex:capture:e92e5fa1-8624-4986-8eaa-7486e126e14a",
                      destination: "urn:hex:entity:connection;OTHER"
                    },
                    {
                      source:
                        "urn:hex:capture:e92e5fa1-8624-4986-8eaa-7486e126e14a",
                      destination: "urn:hex:entity:power;OTHER"
                    },
                    {
                      source:
                        "urn:hex:capture:e92e5fa1-8624-4986-8eaa-7486e126e14a",
                      destination: "urn:hex:entity:everyone;PERSON"
                    },
                    {
                      source:
                        "urn:hex:capture:ad419354-dfc3-4703-87c8-083c78e6d1c1",
                      destination: "urn:hex:entity:connection;OTHER"
                    },
                    {
                      source:
                        "urn:hex:capture:8e43c9ed-3d1f-47e6-a907-c9a9629c1694",
                      destination: "urn:hex:entity:Albert Einstein;PERSON"
                    },
                    {
                      source:
                        "urn:hex:capture:89e5d7ba-badd-4d10-a3b3-451ab6a94cf9",
                      destination: "urn:hex:entity:Albert Einstein;PERSON"
                    },
                    {
                      source:
                        "urn:hex:capture:ad419354-dfc3-4703-87c8-083c78e6d1c1",
                      destination: "urn:hex:entity:Albert Einstein;PERSON"
                    },
                    {
                      source:
                        "urn:hex:capture:63878d7a-7871-4c0d-8137-de7229624447",
                      destination: "urn:hex:entity:Albert Einstein;PERSON"
                    },
                    {
                      source:
                        "urn:hex:capture:29745222-d446-4046-be18-afaa86d92a02",
                      destination: "urn:hex:entity:thoughts;OTHER"
                    }
                  ]}
                />
              </div>
            </div>
            <div className={`dtc-l dt-row w-50 v-mid`}>
              <div className={`f3 pv7-l measure-narrow center lh-copy pa4`}>
                <div className={`f3 dark-gray fw4 pb4`}>Explore your mind.</div>
                <div className={`f4 gray fw2`}>
                  Don’t hold your ideas hostage in files and folders. Tangle
                  creates a network of thoughts and connects the dots for you.
                  Literally.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steven Johnson */}
        <div className={`dt-row w-100`}>
          <div className={`w-100 pt6-l pt4`}>
            <div className={`measure-wide center`}>
              <div className={`f4 fw2 gray lh-copy pb4`}>
                The role of the imagination is to create new meanings and to
                discover connections that, even if obvious, seem to escape
                detection.
              </div>
              <div className={`fr ttu accent lh-copy`}>- Paul Rand</div>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className={`dt-row w-100`}>
          <div className={`dt w-100 mt6-l mt5 br4 b--light-gray ba`}>
            <div className={`dt-row w-100`}>
              <div className={`f3 measure-narrow center lh-copy pa4`}>
                <div className={`f3 dark-gray fw4 pb4`}>
                  Make your old thoughts new.
                </div>
                <div className={`f4 gray fw2`}>
                  Don’t let the great ideas you had a year ago slip through the
                  cracks again. Tangle sparks your creativity by automatically
                  connecting your current thinking to the past.
                </div>
              </div>
            </div>
            <div className={`dtc-l dt-row w-50`}>
              <div className={`w-100 tc`}>
                <img
                  className={`pa4`}
                  style={{
                    maxWidth: "80%"
                  }}
                  src={`https://storage.googleapis.com/usetangle-static-assets/albert-einstein.png`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className={`dt-row w-100`}>
          <div className={`measure-wide center pv6`}>
            <div className={`ttu accent lh-copy pb4`}>Why build Tangle?</div>
            <div className={`f4 fw2 gray lh-copy`}>
              Because we believe in empowering everyone to capture and connect
              thoughts to create big ideas.
            </div>
          </div>
        </div>

        {/* Subscribe */}
        <div className={`dt-row w-100`}>
          <Alpha
            title={"Be one of the first to unleash your knowledge."}
            body={
              "There are limited spots open for early access. We want to collaborate with those who are passionate about creating the future of personal knowledge management."
            }
          />
        </div>

        {/* Data ownwership */}
        <div className={`dt-row w-100`}>
          <div className={`measure-wide center mv6`}>
            <div className={`ttu accent lh-copy pb4`}>PS.</div>
            <div className={`f4 fw2 gray lh-copy`}>
              We know ownership of your data is important to you. Tangle will
              always allow you to export your data, no questions asked.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
