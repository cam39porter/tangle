import React, { Component } from "react";
import Helmet from "react-helmet";

import { ChevronRight } from "react-feather";
import Alpha from "../components/Subscribe/Alpha";

import config from "../../data/SiteConfig";

class Home extends Component {
  render() {
    return (
      <div className={`dt w-100 pt6-l pt4`}>
        <Helmet title={config.siteTitle} />

        {/* Header */}
        <div className={`dt-row vh-50 w-100`}>
          <div className={`h-100 w-100`}>
            <div
              className={`w-50-l w-100 fr pa2 br4 shadow-1`}
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
              <div className={`measure`}>
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
                jot down ideas or import your notes from your favorite service
                without worrying about how to organize them. Tangle does that
                for you. Easily surface useful connections between what you know
                when you build your tangle.
              </div>
            </div>
          </div>
        </div>

        {/* Feature 1 */}
        <div className={`dt-row w-100`}>
          <div className={`dt vh-75 w-100 mt6-l mt5 ba br4 b--light-gray`}>
            <div className={`dt-row w-100`}>
              <div className={`f3 measure-narrow lh-copy pa4`}>
                <div className={`f3 dark-gray fw4 pb4`}>Stop taking notes.</div>
                <div className={`f4 gray fw2`}>
                  Spend more time capturing thoughts and less time organizing
                  them.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className={`dt-row w-100`}>
          <div className={`dt vh-75 w-100 mt6-l mt5 ba br4 b--light-gray`}>
            <div className={`dtc-l dt-row w-50`} />
            <div className={`dtc-l dt-row w-50`}>
              <div className={`f3 measure-narrow center lh-copy pa4`}>
                <div className={`f3 dark-gray fw4 pb4`}>
                  Explore your mind like Google Maps.
                </div>
                <div className={`f4 gray fw2`}>
                  Don’t hold your ideas hostage in files and folders. Tangle
                  creates a network of thoughts and connects the dots for you.
                  Literally.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className={`dt-row w-100`}>
          <div className={`dt vh-75 w-100 mt6-l mt5 br4 b--light-gray ba`}>
            <div className={`dt-row w-100`}>
              <div className={`f3 measure-narrow center lh-copy pa4`}>
                <div className={`f3 dark-gray fw4 pb4`}>
                  Make your old thoughts new again.
                </div>
                <div className={`f4 gray fw2`}>
                  Don’t let the great ideas you had a year ago slip through the
                  cracks again. As you capture more and more, Tangle
                  automatically connects your current thinking to the past.
                </div>
              </div>
            </div>
            <div className={`dtc-l dt-row w-50`} />
          </div>
        </div>

        {/* Mission */}
        <div className={`dt-row w-100`}>
          <div className={`measure-wide center pt6`}>
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
          <div className={`measure-wide center mv6 pa4 br4 b--accent ba`}>
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
