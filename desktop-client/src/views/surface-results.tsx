import * as React from "react";

import NavigationBar from "../components/navigation-bar";

import { GetCapturesQuery } from "../__generated__/types";
import { GetCaptures as QUERY } from "../queries";
import { graphql, QueryProps } from "react-apollo";

import { match } from "react-router";

import config from "../cfg";

interface Params {
  query: string;
}

export interface Props {
  data: QueryProps<GetCapturesQuery>;
  match: match<Params>;
}
class SurfaceResults extends React.Component<Props, object> {
  render() {
    return (
      <div className={`w-100 vh-100 flex-parent`}>
        {/* Navigation Bar */}
        <div className={`clip-s flex-item`}>
          <NavigationBar />
        </div>
        <div className={`flex-item flex-grow measure-narrow shadow-1`}>
          <div
            className={`flex-item drawer h4 measure-narrow bg-${
              config.surfaceBaseColor
            }`}
          >
            {null}
          </div>
          <div className={`flex-item flex-grow measure-narrow bg-light-gray`}>
            {null}
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(QUERY)(SurfaceResults);
