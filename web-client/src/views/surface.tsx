import * as React from "react";

import { SearchQuery as Response } from "../__generated__/types";
import { Search as QUERY } from "../queries";
import { graphql, ChildProps } from "react-apollo";

import { RouteComponentProps } from "react-router";
import ResultListItem from "../components/result-list-item";
import ResultDetail from "../components/result-detail";
import Graph from "../components/graph";
import { Node } from "../components/graph";
import GraphButtons from "../components/graph-buttons";
import Sidebar from "../components/sidebar";
import ResultPagination from "../components/result-pagination";

import { getGradient } from "../utils";

import qs from "qs";

import { split, toLower, assign } from "lodash";

import tinycolor from "tinycolor2";

import config from "../cfg";

const COUNT = 40; // number of results to return
const PAGE_COUNT = 10; // number of results per page

const BLUR_COLOR = "#CCCCCC";
const FOCUS_COLOR_1 = tinycolor("#357EDD");
const FOCUS_COLOR_2 = tinycolor("#CDECFF");

interface InputProps {
  query: string;
}

interface RouteProps extends RouteComponentProps<InputProps> {}

interface Props extends RouteProps, ChildProps<InputProps, Response> {}

interface State {
  id: string;
  query: string;
  focusStartIndex: number;
  isSearch: boolean;
  isDetail: boolean;
  isCapturing: boolean;
}

function getQuery(queryString: string) {
  return (
    qs.parse(queryString, {
      ignoreQueryPrefix: true
    }).query || ""
  );
}

function getId(queryString: string) {
  return (
    qs.parse(queryString, {
      ignoreQueryPrefix: true
    }).id || ""
  );
}

class Surface extends React.Component<Props, State> {
  // eChart instance ref for dispatching events
  eChart;

  searchInput: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);

    this.handleIsCapturing = this.handleIsCapturing.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePageDown = this.handlePageDown.bind(this);
    this.handlePageUp = this.handlePageUp.bind(this);
    this.handleSurfaceDetail = this.handleSurfaceDetail.bind(this);

    this.renderSearchBar = this.renderSearchBar.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.renderDetail = this.renderDetail.bind(this);
    this.renderResultsPagination = this.renderResultsPagination.bind(this);

    const query = getQuery(this.props.location.search);
    const isSearch = query.length !== 0;

    const id = getId(this.props.location.search);
    const isDetail = id.length !== 0;

    this.state = {
      query,
      id,
      focusStartIndex: 0,
      isSearch,
      isDetail,
      isCapturing: false
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    let nextState = {};

    const query = getQuery(this.props.location.search);
    const nextQuery = getQuery(nextProps.location.search);

    if (nextQuery !== query) {
      const isSearch = nextQuery.length !== 0;

      nextState = {
        query: nextQuery,
        focusStartIndex: 0,
        isSearch
      };
    }

    const id = getId(nextProps.location.search);
    const isDetail = id.length !== 0;

    this.setState(assign(nextState, { id, isDetail }));
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
      `/surface?query=${encodeURIComponent(this.state.query || "")}`
    );
  }

  handleSurfaceDetail(id: string) {
    this.props.history.push(
      `/surface?query=${encodeURIComponent(this.state.query || "")}&id=${id}`
    );
    this.handleUnfocusNode();
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

  handleFocusNode(index: number) {
    if (this.eChart) {
      const eChartInstance = this.eChart.getEchartsInstance();

      eChartInstance.dispatchAction({
        type: "focusNodeAdjacency",
        dataIndex: index
      });
    }
  }

  handleUnfocusNode() {
    if (this.eChart) {
      const eChartInstance = this.eChart.getEchartsInstance();

      eChartInstance.dispatchAction({
        type: "unfocusNodeAdjacency"
      });
    }
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
    if (!(this.props.data && this.props.data.search)) {
      return 0;
    }
    // TODO: filter this on node type capture
    return this.props.data.search.graph.nodes.length;
  }

  getNodeData() {
    if (!(this.props.data && this.props.data.search)) {
      return [];
    }

    const graph = this.props.data.search.graph;

    let focusCaptureNodes: Array<Node> = graph.nodes
      .filter((node, index) => {
        return this.isFocusResult(index) && node.type === "CAPTURE";
      })
      .map((capture, index) => {
        return {
          id: capture.id,
          name: capture.text,
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

    let blurCaptureNodes: Array<Node> = graph.nodes
      .filter((node, index) => {
        // filter to focus on only the results not on the current page
        return !this.isFocusResult(index) && node.type === "CAPTURE";
      })
      .map(capture => {
        return {
          id: capture.id,
          name: capture.text,
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

    const queryTerms = split(getQuery(this.props.location.search), " ");

    let entityNodes: Array<Node> = graph.nodes
      .filter(node => {
        return node.type === "ENTITY";
      })
      .filter(entity => {
        const isQueryTerm = queryTerms.reduce((isTerm, term) => {
          return isTerm || toLower(term) === toLower(entity.text);
        }, false);

        return !isQueryTerm && entity.text.length > 4 && entity.text !== "thi";
      })
      .map(entity => {
        return {
          id: entity.id,
          name: entity.text,
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

  getEdgeData() {
    if (!(this.props.data && this.props.data.search)) {
      return [];
    }

    const edges = this.props.data.search.graph.edges;

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

  getCategoryData() {
    const totalFocusResults =
      this.getFocusEndIndex() - this.state.focusStartIndex;
    const gradientNumber = 2 > totalFocusResults ? 2 : totalFocusResults;
    const gradient = getGradient(FOCUS_COLOR_1, FOCUS_COLOR_2, gradientNumber);

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

  renderSearchBar() {
    return (
      <div
        className={`h4 measure absolute z-max ${
          this.state.isSearch ? `bg-light-gray` : ""
        }`}
        style={{ minWidth: "30em" }}
      >
        <div
          className={`center w-90 dt ma4`}
          onClick={() => {
            if (this.searchInput) {
              this.searchInput.focus();
            }
          }}
        >
          <div
            className={`w-100 h2 pa3 dtc v-mid tc bg-white br1 bb bw1 b--${
              config.surfaceAccentColor
            } shadow-1`}
          >
            <input
              className={`f6 w-100`}
              ref={input => {
                this.searchInput = input;
              }}
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

  renderResults() {
    if (
      !(this.props.data && this.props.data.search) ||
      !this.isLoadedWithoutError()
    ) {
      return null;
    }

    const totalFocusResults =
      this.getFocusEndIndex() - this.state.focusStartIndex;
    const gradientNumber = totalFocusResults < 2 ? 2 : totalFocusResults;
    let gradient = getGradient(FOCUS_COLOR_1, FOCUS_COLOR_2, gradientNumber);

    return (
      <div>
        {this.props.data.search.graph.nodes
          .filter((node, index) => {
            return this.isFocusResult(index) && node.type === "CAPTURE";
          })
          .map((capture, index) => {
            return (
              <ResultListItem
                key={capture.id}
                id={capture.id}
                body={capture.text}
                tags={[]}
                onClick={this.handleSurfaceDetail.bind(null, capture.id)}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  this.handleFocusNode(index);
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  this.handleUnfocusNode();
                }}
                nodeColor={gradient[index].toHexString()}
                accentColor={config.surfaceAccentColor}
              />
            );
          })}
      </div>
    );
  }

  renderDetail() {
    return <ResultDetail id={this.state.id} />;
  }

  renderResultsPagination() {
    if (!this.isLoadedWithoutError) {
      return null;
    }

    return (
      <ResultPagination
        totalResults={this.getTotalResults()}
        startIndex={this.state.focusStartIndex}
        endIndex={this.getFocusEndIndex()}
        isActivePageDown={this.state.focusStartIndex > 0}
        handlePageDown={this.handlePageDown}
        isActivePageUp={this.isActivePageUp()}
        handlePageUp={this.handlePageUp}
      />
    );
  }

  renderGraph() {
    if (!this.isLoadedWithoutError()) {
      return null;
    }

    const focusStartIndex = this.state.isSearch
      ? this.state.focusStartIndex
      : undefined;

    const focusEndIndex = this.state.isSearch
      ? this.getFocusEndIndex()
      : undefined;

    return (
      <Graph
        refEChart={e => {
          this.eChart = e;
        }}
        layout={"force"}
        focusStartIndex={focusStartIndex}
        focusEndIndex={focusEndIndex}
        nodeData={this.getNodeData()}
        edgeData={this.getEdgeData()}
        categoryData={this.getCategoryData()}
        tooltipPosition={this.state.isSearch ? ["32", "32"] : "top"}
        onClick={e => {
          if (e.dataType !== "node" || e.data.category === "entity") {
            return;
          }
          this.handleSurfaceDetail(e.data.id);
        }}
      />
    );
  }

  render() {
    return (
      <div className={`w-100 vh-100 flex-column`}>
        <div className={`flex flex-grow relative`}>
          {/* Floating Buttons */}
          <GraphButtons
            handleIsCapturing={this.handleIsCapturing}
            isCapturing={this.state.isCapturing}
          />
          {/* Search */}
          {this.state.isSearch || this.state.isDetail ? (
            <Sidebar
              renderHeader={this.renderSearchBar}
              renderBody={
                !this.state.isDetail ? this.renderResults : this.renderDetail
              }
              renderFooter={
                !this.state.isDetail ? this.renderResultsPagination : () => null
              }
            />
          ) : (
            this.renderSearchBar()
          )}
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
      query: getQuery(ownProps.location.search),
      count: COUNT
    },
    fetchPolicy: "network-only"
  })
})(Surface);

export default SurfaceResultsWithData;
