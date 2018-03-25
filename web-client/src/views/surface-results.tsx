import * as React from "react";

import { SearchQuery } from "../__generated__/types";
import { Search as QUERY } from "../queries";
import { graphql, QueryProps } from "react-apollo";

import { RouteComponentProps } from "react-router";
import NavigationBar from "../components/navigation-bar";
import ListItem from "../components/list-item";
import Network from "../components/network";

import { ChevronRight, ChevronLeft } from "react-feather";

import { shuffle } from "lodash";

import qs from "qs";

import tinycolor from "tinycolor2";
import tinygradient from "tinygradient";

import config from "../cfg";

const COUNT = 100; // number of results to return
const PAGE_COUNT = 20; // number of results per page

const BLUR_COLOR = "#CCCCCC";
const FOCUS_COLOR_1 = tinycolor("#006AFF");
const FOCUS_COLOR_2 = tinycolor("#CBE0FF");

interface Node {
  id: string;
  name: string;
  category: string;
}

interface Params {
  query: string;
}

interface Data extends QueryProps<SearchQuery>, SearchQuery {}

export interface Props extends RouteComponentProps<Params> {
  data: Data;
}

export interface SurfaceResultsState {
  value: string;
  focusStartIndex: number;
}

class SurfaceResults extends React.Component<Props, SurfaceResultsState> {
  constructor(props: Props) {
    super(props);

    this.handleSurface = this.handleSurface.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePageDown = this.handlePageDown.bind(this);
    this.handlePageUp = this.handlePageUp.bind(this);

    this.isFocusResult = this.isFocusResult.bind(this);
    this.isLoadedWithoutError = this.isLoadedWithoutError.bind(this);

    this.getFocusEndIndex = this.getFocusEndIndex.bind(this);
    this.getTotalResults = this.getTotalResults.bind(this);
    this.getCategoryData = this.getCategoryData.bind(this);
    this.getNodeData = this.getNodeData.bind(this);
    this.getResultsGradient = this.getResultsGradient.bind(this);

    this.renderResultsPagination = this.renderResultsPagination.bind(this);
    this.renderResultPagingText = this.renderResultPagingText.bind(this);
    this.renderPageDown = this.renderPageDown.bind(this);
    this.renderPageUp = this.renderPageUp.bind(this);
    this.renderResults = this.renderResults.bind(this);

    this.state = {
      value: qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true
      }).query,
      focusStartIndex: 0
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    }).query;

    const nextQuery = qs.parse(nextProps.location.search, {
      ignoreQueryPrefix: true
    }).query;

    if (nextQuery !== query) {
      this.setState({
        value: nextQuery,
        focusStartIndex: 0
      });
    }
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
    this.props.history.push(`/surface/search?query=${this.state.value}`);
  }

  handlePageDown() {
    const startResultIndex = this.state.focusStartIndex;

    if (startResultIndex === 0) {
      return;
    }

    this.setState({
      focusStartIndex: startResultIndex - PAGE_COUNT
    });
  }

  handlePageUp() {
    const startResultIndex = this.state.focusStartIndex;
    const totalResults = this.getTotalResults();

    if (totalResults < this.state.focusStartIndex + PAGE_COUNT) {
      return;
    }

    this.setState({
      focusStartIndex: startResultIndex + PAGE_COUNT
    });
  }

  isLoadedWithoutError() {
    return (
      this.props.data.loading === false && this.props.data.error === undefined
    );
  }

  isFocusResult(index: number) {
    return (
      index >= this.state.focusStartIndex &&
      index < this.state.focusStartIndex + PAGE_COUNT
    );
  }

  getFocusEndIndex() {
    const totalResults = this.getTotalResults();

    return totalResults < this.state.focusStartIndex + PAGE_COUNT
      ? totalResults
      : this.state.focusStartIndex + PAGE_COUNT;
  }

  getTotalResults() {
    if (this.props.data.search) {
      if (this.props.data.search.pageInfo) {
        return this.props.data.search.pageInfo.total;
      }
    }

    return 0;
  }

  getNodeData() {
    const results = this.props.data.search.results;

    let focusResultsNodes: Array<Node> = results
      .filter((_, index) => {
        // filter to focus on only the results on the current page
        return this.isFocusResult(index);
      })
      .map((capture, index) => {
        return {
          id: capture.id,
          name: capture.body,
          category: `${index}focusResult`
        };
      });

    let blurResultsNodes: Array<Node> = results
      .filter((_, index) => {
        // filter to focus on only the results not on the current page
        return !this.isFocusResult(index);
      })
      .map(capture => {
        return {
          id: capture.id,
          name: capture.body,
          category: "blurResult"
        };
      });

    return shuffle(focusResultsNodes.concat(blurResultsNodes));
  }

  getCategoryData() {
    const gradient = this.getResultsGradient();

    return gradient
      .map((color, index) => {
        return {
          name: `${index}focusResult`,
          itemStyle: {
            normal: {
              color: color.toHexString()
            }
          }
        };
      })
      .concat({
        name: "blurResult",
        itemStyle: {
          normal: {
            color: BLUR_COLOR
          }
        }
      });
  }

  getResultsGradient() {
    const totalFocusResults =
      this.getFocusEndIndex() - this.state.focusStartIndex;
    let gradientNumber = 2 > totalFocusResults ? 2 : totalFocusResults;
    return tinygradient(FOCUS_COLOR_1, FOCUS_COLOR_2).rgb(gradientNumber);
  }

  renderResultsPagination() {
    return (
      <div className={`w-100`}>
        {/* Results Pagination Text */}
        {this.getTotalResults() > 0 ? (
          <div className={`fr pa3 dt`}>
            <div className={`tr f6 gray dtc v-mid`}>
              {this.renderResultPagingText()}
            </div>
            {this.renderPageDown()}
            {this.renderPageUp()}
          </div>
        ) : (
          <div className={`fr pa3 dt`}>
            <div className={`tr f6 gray dtc v-mid`}>No results</div>
          </div>
        )}
      </div>
    );
  }

  renderResultPagingText() {
    return `Showing results ${this.state.focusStartIndex +
      1} - ${this.getFocusEndIndex()}`;
  }

  renderPageDown() {
    let isActive = this.state.focusStartIndex > 0;

    return (
      <div
        className={`f6 dtc v-mid ${isActive ? "gray pointer" : "light-gray"}`}
        onClick={this.handlePageDown}
      >
        <ChevronLeft />
      </div>
    );
  }

  renderPageUp() {
    const totalResults = this.getTotalResults();

    let isActive = totalResults > this.state.focusStartIndex + PAGE_COUNT;

    return (
      <div
        className={`f6 dtc v-mid ${isActive ? "gray pointer" : "light-gray"}`}
        onClick={this.handlePageUp}
      >
        <ChevronRight />
      </div>
    );
  }

  renderResults() {
    let gradient = this.getResultsGradient();

    return this.props.data.search.results
      .filter((_, index) => {
        return this.isFocusResult(index);
      })
      .map((capture, index) => {
        return (
          <ListItem
            body={capture.body}
            onClick={() => {
              return;
            }}
            accentColor={gradient[index].toHexString()}
            key={capture.id}
          />
        );
      });
  }

  render() {
    return (
      <div className={`w-100 vh-100 flex-column`}>
        {/* Navigation Bar */}
        <div className={`db`}>
          <NavigationBar />
        </div>

        <div className={`flex flex-grow`}>
          {/* Sidebar */}
          <div className={`flex-column flex-grow  measure shadow-1`}>
            {/* Search Header */}
            <div
              className={`flex-column drawer h4 measure bg-${
                config.surfaceBaseColor
              }`}
            >
              {/* Search Bar */}
              <div
                className={`center w-90 ma3 pa3 h2 bg-white dt br1 b--light-gray shadow-1`}
              >
                <div className={`w-100 dtc v-mid tc`}>
                  <input
                    className={`f6 w-80`}
                    value={this.state.value}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div
              className={`flex-column flex-grow measure bg-light-gray overflow-auto`}
            >
              {this.isLoadedWithoutError() ? this.renderResults() : null}
            </div>

            {/* Pagination Footer */}
            <div
              className={`flex-column drawer h3 measure bg-white bt b--light-gray`}
            >
              {this.isLoadedWithoutError()
                ? this.renderResultsPagination()
                : null}
            </div>
          </div>

          {/* Graph Visualization */}
          <div className={`flex-column flex-grow`}>
            {this.isLoadedWithoutError() ? (
              <Network
                focusStartIndex={this.state.focusStartIndex}
                focusEndIndex={this.getFocusEndIndex()}
                nodeData={this.getNodeData()}
                categoryData={this.getCategoryData()}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const SurfaceResultsWithData = graphql(QUERY, {
  options: (ownProps: Props) => ({
    variables: {
      query: qs.parse(ownProps.location.search, {
        ignoreQueryPrefix: true
      }).query,
      count: COUNT
    },
    fetchPolicy: "network-only"
  })
})(SurfaceResults);

export default SurfaceResultsWithData;
