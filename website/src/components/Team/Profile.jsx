import * as React from "react";

import { Linkedin } from "react-feather";

const Profile = props => {
  return (
    <div className={`vh-75 measure-narrow center`}>
      <a className={`link`} href={props.link}>
        <div
          className={`relative dt w-100 ba br4 b--light-gray pa4 lh-copy grow pointer`}
        >
          <div
            className={`f7 absolute br4 top--1 right--1 bg-accent white pv2 ph3`}
          >
            {props.subtitle}
          </div>
          <div className={`dt-row`}>
            <img src={props.bitmoji} />
          </div>
          <div className={`dt-row`}>
            <div className={`f4 fw3 dark-gray pt2`}>{props.name}</div>
          </div>
          <div className={`dt-row`}>
            <div className={`dt pt2`}>
              <div className={`dtc f4 fw4 f4 gray v-mid pr2`}>
                {props.title}
              </div>
              {props.founder && (
                <div className={`pl2 dtc f5 fw3 accent v-mid bl b--accent`}>
                  <span className={``}>{`founder`}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Profile;
