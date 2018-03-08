import * as React from "react";

import { GetCapturesQuery } from "../__generated__/types";
import { GetCaptures as QUERY } from "../queries";
import { graphql, QueryProps } from "react-apollo";

import { RouteComponentProps } from "react-router";
import TextInput from "../components/text-input";
import NavigationBar from "../components/navigation-bar";

import * as _ from "lodash";

import config from "../cfg";

interface Params {
  query: string;
}

export interface Props extends RouteComponentProps<Params> {
  data: QueryProps<GetCapturesQuery>;
}

export interface SurfaceResultsState {
  value: string;
}

class SurfaceResults extends React.Component<Props, SurfaceResultsState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.props.match.params.query
    };

    this.handleSurface = this.handleSurface.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value: string): void {
    this.setState({
      value: _.trim(value)
    });
  }

  handleSurface() {
    this.props.history.push(`/surface/${this.state.value}`);
  }

  render() {
    return (
      <div className={`w-100 vh-100 flex-parent`}>
        {/* Navigation Bar */}
        <div className={`clip-s flex-item`}>
          <NavigationBar />
        </div>

        {/* Sidebar */}
        <div className={`flex-item flex-grow measure-narrow shadow-1`}>
          <div
            className={`flex-item drawer h4 measure-narrow bg-${
              config.surfaceBaseColor
            }`}
          >
            {/* Search Bar */}
            <div className={`center w-90 ma3 h2 bg-white dt`}>
              <div className={`w-100 dtc v-mid`}>
                <TextInput
                  startingValue={this.state.value}
                  handleEnterKey={this.handleSurface}
                  handleChange={this.handleChange}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={`flex-item flex-grow measure-narrow bg-light-gray`}>
            {null}
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(QUERY)(SurfaceResults);
