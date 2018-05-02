import * as React from "react";

import { ChevronRight } from "react-feather";

const Alpha = props => {
  return (
    <div
      className={`dt vh-25 w-100 ba br4 bg-light-gray b--light-gray pa4 mt6`}
    >
      <div className={`dtc-l dt-row`}>
        <div className={`f3 measure-wide lh-copy pv4`}>
          <div className={`f3 dark-gray fw4 pb4`}>{props.title}</div>
          <div className={`f4 gray fw2`}>{props.body}</div>
        </div>
      </div>
      <div className={`dtc-l dt-row center v-mid pa4 tl`}>
        <a href={`http://eepurl.com/dtlCKD`} className={`link`}>
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
        </a>
      </div>
    </div>
  );
};

export default Alpha;
