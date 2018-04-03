import * as React from "react";

import { SearchQuery as Response } from "../__generated__/types";
import { Search as QUERY } from "../queries";
import { graphql, ChildProps } from "react-apollo";

import { RouteComponentProps } from "react-router";
import ResultListItem from "../components/result-list-item";
import Graph from "../components/graph";
import { Node } from "../components/graph";
import CaptureDialogue from "../components/capture-dialogue";

import { ChevronRight, ChevronLeft } from "react-feather";

import qs from "qs";

import { split, toLower } from "lodash";

import tinycolor from "tinycolor2";
import tinygradient from "tinygradient";

import config from "../cfg";

const COUNT = 40; // number of results to return
const PAGE_COUNT = 10; // number of results per page
const SURFACE_COUNT = 500; // number of results to show on home surface page

const BLUR_COLOR = "#CCCCCC";
const FOCUS_COLOR_1 = tinycolor("#357EDD");
const FOCUS_COLOR_2 = tinycolor("#CDECFF");

interface InputProps {
  query: string;
}

interface RouteProps extends RouteComponentProps<InputProps> {}

interface Props extends RouteProps, ChildProps<InputProps, Response> {}

interface State {
  query: string;
  focusStartIndex: number;
  isSearch: boolean;
  isCapturing: boolean;
}

class Surface extends React.Component<Props, State> {
  // eChart instance ref for dispatching events
  eChart;

  constructor(props: Props) {
    super(props);

    this.handleIsCapturing = this.handleIsCapturing.bind(this);
    this.handleSurface = this.handleSurface.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePageDown = this.handlePageDown.bind(this);
    this.handlePageUp = this.handlePageUp.bind(this);

    this.isActivePageUp = this.isActivePageUp.bind(this);
    this.isFocusResult = this.isFocusResult.bind(this);
    this.isLoadedWithoutError = this.isLoadedWithoutError.bind(this);

    this.getFocusEndIndex = this.getFocusEndIndex.bind(this);
    this.getTotalResults = this.getTotalResults.bind(this);
    this.getSurfaceNodeData = this.getSurfaceNodeData.bind(this);
    this.getSurfaceCategoryData = this.getSurfaceCategoryData.bind(this);
    this.getResultsCategoryData = this.getResultsCategoryData.bind(this);
    this.getResultsNodeData = this.getResultsNodeData.bind(this);
    this.getGradient = this.getGradient.bind(this);

    this.renderResultsPagination = this.renderResultsPagination.bind(this);
    this.renderResultPagingText = this.renderResultPagingText.bind(this);
    this.renderPageDown = this.renderPageDown.bind(this);
    this.renderPageUp = this.renderPageUp.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.renderSearchBar = this.renderSearchBar.bind(this);
    this.renderSideBar = this.renderSideBar.bind(this);
    this.renderGraph = this.renderGraph.bind(this);

    const query =
      qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true
      }).query || "";

    this.state = {
      query,
      focusStartIndex: 0,
      isSearch: !!query,
      isCapturing: false
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
        query: nextQuery,
        focusStartIndex: 0,
        isSearch: !!nextQuery
      });
    }
  }

  handleIsCapturing() {
    this.setState({
      isCapturing: !this.state.isCapturing
    });
  }

  handleChange(e: React.FormEvent<HTMLInputElement>): void {
    const query = e.currentTarget.value;

    this.setState({
      query
    });

    if (query === "") {
      this.props.history.push(`/surface`);
    }
  }

  handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.handleSurface();
    }
  }

  handleSurface() {
    this.props.history.push(
      `/surface?query=${encodeURIComponent(this.state.query)}`
    );
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
    if (!this.isActivePageUp()) {
      return;
    }

    this.setState({
      focusStartIndex: this.state.focusStartIndex + PAGE_COUNT
    });
  }

  isActivePageUp() {
    return this.getTotalResults() > this.getFocusEndIndex();
  }

  isLoadedWithoutError() {
    return (
      this.props.data &&
      this.props.data.loading === false &&
      this.props.data.error === undefined
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
    if (!(this.props.data && this.props.data.searchv2)) {
      return 0;
    }
    return this.props.data.searchv2.graph.captures.length;
  }

  getSurfaceNodeData() {
    if (
      !(
        this.props.data &&
        this.props.data.searchv2 &&
        this.props.data.getCaptures
      )
    ) {
      return [];
    }

    const results = this.props.data.getCaptures.results;
    return results.map((capture, index) => {
      return {
        id: capture.id,
        name: capture.body,
        category: `${index}surfaceResult`,
        label: {
          show: false,
          emphasis: {
            show: false
          }
        }
      };
    });
  }

  getSurfaceCategoryData() {
    const gradient = this.getGradient(SURFACE_COUNT);

    return gradient.map((color, index) => {
      return {
        name: `${index}surfaceResult`,
        itemStyle: {
          normal: {
            color: color.toHexString()
          }
        }
      };
    });
  }

  getResultsNodeData() {
    if (!(this.props.data && this.props.data.searchv2)) {
      return [];
    }

    const graph = this.props.data.searchv2.graph;

    let focusCaptureNodes: Array<Node> = graph.captures
      .filter((_, index) => {
        // filter to focus on only the results on the current page
        return this.isFocusResult(index);
      })
      .map((capture, index) => {
        return {
          id: capture.id,
          name: capture.body,
          category: `${index}focusResult`,
          symbolSize: 24,
          label: {
            show: false,
            emphasis: {
              show: false
            }
          }
        };
      });

    let blurCaptureNodes: Array<Node> = graph.captures
      .filter((_, index) => {
        // filter to focus on only the results not on the current page
        return !this.isFocusResult(index);
      })
      .map(capture => {
        return {
          id: capture.id,
          name: capture.body,
          category: "blurResult",
          symbolSize: 16,
          label: {
            show: false,
            emphasis: {
              show: false
            }
          }
        };
      });

    const queryTerms = split(
      qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true
      }).query,
      " "
    );

    let entityNodes: Array<Node> = graph.entities
      .filter(entity => {
        const isQueryTerm = queryTerms.reduce((isTerm, term) => {
          return isTerm || toLower(term) === toLower(entity.name);
        }, false);

        return !isQueryTerm && entity.name.length > 2 && entity.name !== "thi";
      })
      .map(entity => {
        return {
          id: entity.id,
          name: entity.name,
          category: "entity",
          symbolSize: 12,
          label: {
            show: true,
            color: "#777777",
            emphasis: {
              show: true
            }
          }
        };
      });

    return focusCaptureNodes.concat(blurCaptureNodes).concat(entityNodes);
  }

  getResultsEdgeData() {
    if (!(this.props.data && this.props.data.searchv2)) {
      return [];
    }

    const edges = this.props.data.searchv2.graph.edges;

    return edges.map(edge => {
      return {
        source: edge.source,
        target: edge.destination,
        label: {
          show: false,
          emphasis: {
            show: false
          }
        }
      };
    });
  }

  getResultsCategoryData() {
    const totalFocusResults =
      this.getFocusEndIndex() - this.state.focusStartIndex;
    const gradientNumber = 2 > totalFocusResults ? 2 : totalFocusResults;
    const gradient = this.getGradient(gradientNumber);

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
      })
      .concat({
        name: "entity",
        itemStyle: {
          normal: {
            color: "#FFFFFF"
          }
        }
      });
  }

  getGradient(gradientNumber: number) {
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
    return (
      <div
        className={`f6 dtc v-mid ${
          this.isActivePageUp() ? "gray pointer" : "light-gray"
        }`}
        onClick={this.handlePageUp}
      >
        <ChevronRight />
      </div>
    );
  }

  renderResults() {
    if (!(this.props.data && this.props.data.searchv2)) {
      return;
    }

    const totalFocusResults =
      this.getFocusEndIndex() - this.state.focusStartIndex;
    const gradientNumber = totalFocusResults < 2 ? 2 : totalFocusResults;
    let gradient = this.getGradient(gradientNumber);

    return this.props.data.searchv2.graph.captures
      .filter((_, index) => {
        return this.isFocusResult(index);
      })
      .map((capture, index) => {
        return (
          <div
            key={capture.id}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
              if (this.eChart) {
                const eChartInstance = this.eChart.getEchartsInstance();

                eChartInstance.dispatchAction({
                  type: "focusNodeAdjacency",
                  dataIndex: index
                });
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
              if (this.eChart) {
                const eChartInstance = this.eChart.getEchartsInstance();

                eChartInstance.dispatchAction({
                  type: "unfocusNodeAdjacency"
                });
              }
            }}
          >
            <ResultListItem
              body={capture.body}
              tags={capture.tags}
              onClick={() => {
                return;
              }}
              nodeColor={gradient[index].toHexString()}
              accentColor={config.surfaceAccentColor}
            />
          </div>
        );
      });
  }

  renderSearchBar() {
    return (
      <div
        className={`drawer h4 measure absolute z-max ${
          this.state.isSearch ? `bg-light-gray` : ""
        }`}
        style={{ minWidth: "30em" }}
      >
        <div className={`center w-90 dt ma4`}>
          <div
            className={`w-100 h2 pa3 dtc v-mid tc bg-white br1 bb bw1 b--${
              config.surfaceAccentColor
            } shadow-1`}
          >
            <input
              className={`f6 w-100`}
              value={this.state.query || ""}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              placeholder={"What are you looking for..."}
              autoFocus={true}
              onFocus={e => {
                // focus on the end value in the input
                var tempValue = e.target.value;
                e.target.value = "";
                e.target.value = tempValue;
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  renderSideBar() {
    return (
      <div className={`flex-column flex-grow z-max measure shadow-3`}>
        {/* Search Bar */}
        {this.renderSearchBar()}

        {/* Results */}
        <div
          className={`flex-column flex-grow measure bg-light-gray overflow-auto`}
        >
          {/* Padding to ensure results start below the search bar */}
          <div className={`h4 measure`} />
          {/* Results List */}
          {this.isLoadedWithoutError() ? this.renderResults() : null}
        </div>

        {/* Pagination Footer */}
        <div
          className={`flex-column drawer h3 measure bg-white bt b--light-gray`}
        >
          {this.isLoadedWithoutError() ? this.renderResultsPagination() : null}
        </div>
      </div>
    );
  }

  renderGraph() {
    if (!this.isLoadedWithoutError()) {
      return null;
    }

    const nodeData = this.state.isSearch
      ? this.getResultsNodeData()
      : this.getSurfaceNodeData();

    const edgeData = this.state.isSearch ? this.getResultsEdgeData() : [];

    const categoryData = this.state.isSearch
      ? this.getResultsCategoryData()
      : this.getSurfaceCategoryData();

    const focusStartIndex = this.state.isSearch
      ? this.state.focusStartIndex
      : undefined;

    const focusEndIndex = this.state.isSearch
      ? this.getFocusEndIndex()
      : undefined;

    return (
      <div className={`flex-column flex-grow`}>
        <Graph
          refEChart={e => {
            this.eChart = e;
          }}
          layout={"force"}
          focusStartIndex={focusStartIndex}
          focusEndIndex={focusEndIndex}
          nodeData={nodeData}
          edgeData={edgeData}
          categoryData={categoryData}
        />
      </div>
    );
  }

  renderFloatingButtons() {
    return (
      <div className={`bottom-2 right-2 absolute z-999`}>
        {this.state.isCapturing ? (
          <CaptureDialogue handleMinimize={this.handleIsCapturing} />
        ) : (
          <div
            className={`dt h3 w3 white br1 bg-${
              config.captureAccentColor
            } shadow-1 pointer`}
            onClick={this.handleIsCapturing}
          >
            <div className={`dtc tc v-mid f3`}>+</div>
          </div>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className={`w-100 vh-100 flex-column`}>
        <div className={`flex flex-grow relative`}>
          {/* Floating Buttons */}
          {this.renderFloatingButtons()}
          {/* Search */}
          {this.state.isSearch ? this.renderSideBar() : this.renderSearchBar()}
          {/* Graph */}
          {this.renderGraph()}
        </div>
      </div>
    );
  }
}

const SurfaceResultsWithData = graphql<Response, Props>(QUERY, {
  options: (ownProps: Props) => ({
    variables: {
      query:
        qs.parse(ownProps.location.search, {
          ignoreQueryPrefix: true
        }).query || "",
      count: COUNT,
      surfaceCount: SURFACE_COUNT
    },
    fetchPolicy: "network-only"
  })
})(Surface);

export default SurfaceResultsWithData;
