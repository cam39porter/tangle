import * as React from "react";

import { GetCapturesQuery } from "../__generated__/types";
import { GetCaptures as QUERY } from "../queries";
import { graphql, QueryProps } from "react-apollo";

import { RouteComponentProps } from "react-router";
import NavigationBar from "../components/navigation-bar";
import ListItem from "../components/list-item";

import config from "../cfg";

interface Params {
  query: string;
}

interface Data extends QueryProps<GetCapturesQuery>, GetCapturesQuery {}

export interface Props extends RouteComponentProps<Params> {
  data: Data;
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
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.renderResults = this.renderResults.bind(this);
  }

  handleChange(e: React.FormEvent<HTMLInputElement>): void {
    this.setState({
      value: e.currentTarget.value
    });
  }

  handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.handleSurface();
    }
  }

  handleSurface() {
    this.props.history.push(`/surface/${this.state.value}`);
  }

  renderResults() {
    return this.props.data.getCaptures.map(capture => {
      return (
        <ListItem
          body={capture.body}
          onClick={() => {
            //
            return;
          }}
          accentColor={config.surfaceAccentColor}
          key={capture.id}
        />
      );
    });
  }

  render() {
    return (
      <div className={`w-100 vh-100 flex-parent`}>
        {/* Navigation Bar */}
        <div className={`clip-s flex-item`}>
          <NavigationBar />
        </div>

        {/* Sidebar */}
        <div className={`flex-item flex-grow measure shadow-1`}>
          {/* Header */}
          <div
            className={`flex-item drawer h4 measure bg-${
              config.surfaceBaseColor
            }`}
          >
            {/* Search Bar */}
            <div
              className={`center w-90 ma3 pa3 h2 bg-white dt br1 b--light-gray shadow-1`}
            >
              <div className={`w-100 dtc v-mid tc`}>
                <input
                  className={`f6 roboto w-80`}
                  value={this.state.value}
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div
            className={`flex-item flex-grow measure bg-light-gray overflow-auto`}
          >
            {this.props.data.loading === false &&
            this.props.data.error === undefined
              ? this.renderResults()
              : null}
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(QUERY)(SurfaceResults);
