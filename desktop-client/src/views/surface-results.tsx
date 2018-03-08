import * as React from "react";

import NavigationBar from "../components/navigation-bar";

import { GetCapturesQuery } from "../__generated__/types";
import { GetCaptures as QUERY } from "../queries";
import { graphql, QueryProps } from "react-apollo";

import { match } from "react-router";
import TextInput from "../components/text-input";

import config from "../cfg";

interface Params {
  query: string;
}

export interface Props {
  data: QueryProps<GetCapturesQuery>;
  match: match<Params>;
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
      value
    });
  }

  handleSurface() {
    const surface = this.state.value;
    if (surface === "") {
      return;
    }
  }

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
          <div className={`flex-item flex-grow measure-narrow bg-light-gray`}>
            {null}
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(QUERY)(SurfaceResults);
