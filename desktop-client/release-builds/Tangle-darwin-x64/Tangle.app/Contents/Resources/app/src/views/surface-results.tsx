import * as React from "react";

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
      <div className={`w-100`}>
        <div className={`flex-column self-stretch measure-narrow  `}>
          <div
            className={`h4 measure-narrow bg-${
              config.surfaceBaseColor
            } shadow-5`}
          >
            {null}
          </div>
          <div className={`measure-narrow bg-light-gray shadow-5`}>{null}</div>
        </div>
      </div>
    );
  }
}

export default graphql(QUERY)(SurfaceResults);
