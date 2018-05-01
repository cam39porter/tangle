import React, { Component } from "react";
import Helmet from "react-helmet";

import { ChevronRight } from "react-feather";

import config from "../../data/SiteConfig";

class Home extends Component {
  render() {
    return (
      <div className={`w-100 pt6-l pt5`}>
        <Helmet title={config.siteTitle} />

        {/* Header */}
        <div className={`vh-50 w-100`}>
          <div className={`w-50-l w-100 fr pb4`}>
            <img
              className={`pa3 br4 shadow-1`}
              src={`../../static/screelhots/capture..png`}
            />
          </div>
          <div className={`w-50-l w-100 fl`}>
            <div className={`measure`}>
              <div className={`f3 lh-copy dark-gray fw4 pb4`}>
                Connect your thoughts.
              </div>
              <div className={`f3 lh-copy gray fw1 pb4`}>
                It's hard to know everything you know. Effortlessly surface the
                connections between your notes with the power of Tangle.
              </div>
              <div className={`dt`}>
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
              </div>
            </div>
          </div>
        </div>

        {/* What is it */}
        <div className={`vh-50 w-100 pt6-l pt5`}>
          <div className={`measure-wide center`}>
            <div className={`ttu accent lh-copy pb4`}>what is it?</div>
            <div className={`f4 fw2 gray lh-copy`}>
              Tangle is your personal knowledge graph. Capture your thoughts,
              jot down ideas or take notes without worrying about how to
              organize them. Tangle does that for you. Easily surface
              interesting linkages between what you know when you search your
              tangle.
            </div>
          </div>
        </div>

        {/* Feature 1 */}
        <div className={`dt vh-50 w-100 mt6-l mt5 ba br4 b--light-gray`}>
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

        {/* Feature 2 */}
        <div className={`dt vh-50 w-100 mt6-l mt5 ba br4 b--light-gray`}>
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

        {/* Mission */}
        <div className={`vh-50 w-100 pt6`}>
          <div className={`measure-wide center`}>
            <div className={`ttu accent lh-copy pb4`}>Why build Tangle?</div>
            <div className={`f4 fw2 gray lh-copy`}>
              Because we believe in empowering everyone to capture and connect
              thoughts to create big ideas.
            </div>
          </div>
        </div>

        {/* Subscribe */}
        <div
          className={`dt vh-25 w-100 ba br4 bg-light-gray b--light-gray pa4 mb6`}
        >
          <div className={`dtc-l dt-row`}>
            <div className={`f3 measure-wide lh-copy pv4`}>
              <div className={`f3 dark-gray fw4 pb4`}>
                Be one of the first to unleash your knowledge.
              </div>
              <div className={`f4 gray fw2`}>
                There are limited spots open for early access. We want to
                collaborate with those who are passionate about creating the
                future of personal knowledge management.
              </div>
            </div>
          </div>
          <div className={`dtc-l dt-row center v-mid pa4 tl`}>
            <div
              className={`dt center bg-accent white bg-accent white br4 pa3 pointer`}
            >
              <div className={`dtc`}>
                <span className={`f4`}>Get early access</span>
              </div>
              <div className={`dtc v-mid`}>
                <ChevronRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
