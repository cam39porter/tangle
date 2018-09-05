import * as React from "react";
import * as ReactDOM from "react-dom";
import { ChevronRight } from "react-feather";

import "./css/custom.css";
import "./tachyons.css";

ReactDOM.render(
  <div className={`avenir dt vh-100 w-100 bg-near-white`}>
    <div className={`dtc v-mid`}>
      <div className={`center measure pa4 bg-white br4 shadow-1 tc`}>
        <div>
          <img
            src="https://storage.googleapis.com/usetangle-static-assets/logo.png"
            className={`pa2 bb bw2 b--accent`}
            style={{
              maxHeight: "5em"
            }}
          />
          <div className={`h2`} />
          <div className={`dt w-100 ba br4 bg-light-gray b--light-gray pa4`}>
            <div className={`f3 measure-wide lh-copy pv4`}>
              <div className={`f3 dark-gray fw4 pb4`}>Update</div>
              <div className={`f4 gray fw2 tl`}>
                After receiving feedback from our alpha users, we have decided
                to shut down the current version Tangle. We are continuing to
                work hard as a team, leveraging our learnings from this initial
                test.{" "}
                <p className={`fw4`}>
                  Please email us if you would like your data exported as a csv
                  or if you have any questions or comments.
                </p>
              </div>
            </div>
            <a href={`mailto:info@usetangle.com`} className={`link`}>
              <div
                className={`dt dim center bg-accent white bg-accent white br4 pa3 pointer`}
              >
                <div className={`dtc pt1`}>
                  <span className={`f4`}>Email us</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>,
  document.getElementById("root") as HTMLElement
);
