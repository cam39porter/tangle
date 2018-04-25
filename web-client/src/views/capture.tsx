// React
import * as React from "react";
import * as ReactDOM from "react-dom";

// GraphQL
import {
  DailyCapturesQuery as Response,
  NodeType,
  EdgeType
} from "../__generated__/types";
import { DailyCaptures as QUERY } from "../queries";
import { graphql, ChildProps } from "react-apollo";

// Router
import { RouteComponentProps } from "react-router";

// Components
import ResultListItem from "../components/result-list-item";
import Graph from "../components/graph";
import { GraphNode } from "../components/graph";
import GraphButtons from "../components/graph-buttons";
import Sidebar from "../components/sidebar";
import SidebarSectionHeader from "../components/sidebar-section-header";
import ScrollContainerElement from "../components/scroll-container-element";

// Config / Utils
import config from "../cfg";
import { assign, mapKeys } from "lodash";
import windowSize from "react-window-size";

const FOCUS_COLOR_1 = "#A463F2";
const FOCUS_COLOR_2 = "#9EEBCF";

interface Node {
  __typename: "Node";
  id: string;
  type: NodeType;
  text: string;
  level: number | null;
}

interface Edge {
  __typename: "Edge";
  source: string;
  destination: string;
  type: EdgeType;
  salience: number | null;
}

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps, ChildProps<{}, Response> {
  windowWidth: number;
  windowHeight: number;
}

interface State {
  isShowingList: boolean;
  isCapturing: boolean;
  hoverFocus: Node | null;
  nodeIdToIndex: Object;
  resultOptionsIsOpenMap: Object;
}

class Capture extends React.Component<Props, State> {
  // eChart instance ref for dispatching events
  eChart;

  searchInput: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isShowingList: false,
      isCapturing: true,
      hoverFocus: null,
      nodeIdToIndex: {},
      resultOptionsIsOpenMap: {}
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    let nextState = {};

    // update mappings
    let nextResultOptionsIsOpenMap = [];
    let nextNodeIdToIndex = {};
    let nodes: Array<Node> = [];
    if (nextProps.data) {
      if (nextProps.data.getAll && nextProps.data.getAll.graph.nodes) {
        nodes = nextProps.data.getAll.graph.nodes;
      }
    }
    nodes.forEach((node, index) => {
      nextNodeIdToIndex[node.id] = index;
      if (node.type === "Capture") {
        nextResultOptionsIsOpenMap[node.id] = false;
      }
    });
    nextState = assign(
      {
        nodeIdToIndex: nextNodeIdToIndex,
        resultOptionsIsOpenMap: nextResultOptionsIsOpenMap
      },
      nextState
    );

    // update state
    this.setState(nextState);
  }

  handleResultListItemRefetch = (id: string) => {
    this.props.data && this.props.data.refetch();
  };

  handleResultActionBarChange = (id: string) => {
    let nextResultOptionsIsOpenMap = this.state.resultOptionsIsOpenMap;
    const isOpen = nextResultOptionsIsOpenMap[id] ? true : false;

    if (isOpen) {
      nextResultOptionsIsOpenMap[id] = false;
      nextResultOptionsIsOpenMap;
      this.setState({
        resultOptionsIsOpenMap: nextResultOptionsIsOpenMap
      });
      return;
    }

    nextResultOptionsIsOpenMap = mapKeys(nextResultOptionsIsOpenMap, () => {
      return false;
    });

    nextResultOptionsIsOpenMap[id] = true;

    this.setState({
      resultOptionsIsOpenMap: nextResultOptionsIsOpenMap
    });
    return;
  };

  handleIsShowingList = () => {
    this.setState({
      isShowingList: !this.state.isShowingList
    });
  };

  handleIsCapturing = () => {
    this.setState({
      isCapturing: !this.state.isCapturing
    });
  };

  handleSurfaceDetail = (id: string) => {
    this.props.history.push(`/surface?id=${encodeURIComponent(id)}`);
    this.handleUnfocusNode();
  };

  handleFocusNode = (id: string) => {
    if (this.eChart) {
      const eChartInstance = this.eChart.getEchartsInstance();

      eChartInstance.dispatchAction({
        type: "focusNodeAdjacency",
        dataIndex: this.state.nodeIdToIndex[id]
      });
    }
  };

  handleUnfocusNode = () => {
    if (this.eChart) {
      const eChartInstance = this.eChart.getEchartsInstance();

      eChartInstance.dispatchAction({
        type: "unfocusNodeAdjacency"
      });
    }
  };

  handleFocusInput = (shouldFocus: boolean) => {
    const input = ReactDOM.findDOMNode(this).querySelector("input");

    if (input) {
      shouldFocus ? input.focus() : input.blur();
    }
  };

  isLargeWindow = () => {
    return this.props.windowWidth >= 1024;
  };

  isLoadedWithoutError = () => {
    return (
      this.props.data &&
      this.props.data.loading === false &&
      this.props.data.error === undefined
    );
  };

  getGradientNumber = () => {
    if (!(this.props.data && this.props.data.getAll)) {
      return 2;
    }

    let resultCount = this.props.data.getAll.graph.nodes.reduce(
      (count, node) => {
        if (node.type === "Capture") {
          return count + 1;
        }
        return count;
      },
      0
    );

    return resultCount < 3 ? 2 : resultCount;
  };

  getNodeData = (): Array<GraphNode> => {
    if (!this.props.data) {
      return [];
    }

    let nodes: Array<Node> = [];

    if (this.props.data.getAll) {
      nodes = this.props.data.getAll.graph.nodes;
    }

    return nodes.map((node, index) => {
      switch (node.type) {
        // Entities
        case NodeType.Entity:
          return {
            id: node.id,
            name: node.text,
            category: "entity"
          };

        // Tags
        case NodeType.Tag:
          return {
            id: node.id,
            name: node.text,
            category: "tag"
          };

        // Captures
        default:
          if (node.level === 0) {
            return {
              id: node.id,
              name: node.text,
              category: "detail"
            };
          }

          return {
            id: node.id,
            name: node.text,
            category: `blur`
          };
      }
    });
  };

  getEdgeData = (): Array<{ source: string; destination: string }> => {
    if (!this.props.data) {
      return [];
    }

    let edges: Array<Edge> = [];

    if (this.props.data.getAll) {
      edges = this.props.data.getAll.graph.edges;
    }

    return edges.map(edge => {
      return {
        source: edge.source,
        destination: edge.destination
      };
    });
  };

  renderCaptureCount = () => {
    let dailyCaptureCount = 0;

    if (this.props.data && this.props.data.getAll) {
      dailyCaptureCount = this.props.data.getAll.graph.nodes.filter(node => {
        return node.type === "Capture" && node.level === 0;
      }).length;
    }

    return (
      <div
        className={`fixed top-1 top-2-l center ph2 w-100 w-third-l dt pv0-l ph4-l z-999 pointer`}
        onClick={
          !dailyCaptureCount
            ? () => {
                return;
              }
            : this.handleIsShowingList
        }
        style={{
          minHeight: "3rem"
        }}
      >
        <div
          className={`w-100 f6 dtc v-mid tc bg-${
            this.state.isShowingList
              ? `white gray`
              : dailyCaptureCount
                ? `white ${config.captureAccentColor}`
                : `light-gray gray`
          } br4 shadow-1`}
        >
          {!dailyCaptureCount
            ? "Make your first capture today!"
            : `You have made ${dailyCaptureCount} captures today!`}
        </div>
      </div>
    );
  };

  renderResults = (nodes?: Array<Node>) => {
    if (!this.isLoadedWithoutError) {
      return null;
    }

    if (!(this.props.data && this.props.data.getAll)) {
      return null;
    }

    let detailNodes: Array<Node> = [];

    const captureNodes = this.props.data.getAll.graph.nodes.filter(node => {
      if (node.type === "Capture") {
        if (node.level === 0) {
          detailNodes = detailNodes.concat(node);
          return false;
        }
        return true;
      }
      return false;
    });

    return (
      <div>
        <SidebarSectionHeader title={"today's captures"} />
        {detailNodes.map((capture, index) => {
          return (
            <ScrollContainerElement key={capture.id} name={capture.id}>
              <ResultListItem
                key={capture.id}
                id={capture.id}
                body={capture.text}
                onClick={this.handleSurfaceDetail.bind(null, capture.id)}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  this.handleFocusNode(capture.id);
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  this.handleUnfocusNode();
                }}
                accentColor={config.captureAccentColor}
                baseColor={config.captureBaseColor}
                textColor={"near-white"}
                isFocus={
                  (this.isLargeWindow() &&
                    (this.state.hoverFocus &&
                      this.state.hoverFocus.id === capture.id)) === true
                }
                showActionBar={this.state.resultOptionsIsOpenMap[capture.id]}
                onShowActionBarChange={this.handleResultActionBarChange}
                handleRefetch={this.handleResultListItemRefetch}
              />
            </ScrollContainerElement>
          );
        })}
        <SidebarSectionHeader title={"related captures"} />
        {captureNodes.map((capture, index) => {
          return (
            <ScrollContainerElement key={capture.id} name={capture.id}>
              <ResultListItem
                key={capture.id}
                id={capture.id}
                body={capture.text}
                onClick={this.handleSurfaceDetail.bind(null, capture.id)}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  this.handleFocusNode(capture.id);
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  this.handleUnfocusNode();
                }}
                accentColor={config.captureAccentColor}
                baseColor={"gray"}
                isFocus={
                  (this.isLargeWindow() &&
                    (this.state.hoverFocus &&
                      this.state.hoverFocus.id === capture.id)) === true
                }
                showActionBar={this.state.resultOptionsIsOpenMap[capture.id]}
                onShowActionBarChange={this.handleResultActionBarChange}
                handleRefetch={this.handleResultListItemRefetch}
              />
            </ScrollContainerElement>
          );
        })}
      </div>
    );
  };

  renderHideList = () => {
    return (
      <div
        className={`dt br4 br--bottom w-100 bg-white pointer`}
        onClick={this.handleIsShowingList}
      >
        <div className={`dtc v-mid w-100 h2 pa3 ttu f6 gray`}>
          {this.state.isShowingList ? "hide list" : "show list"}
        </div>
      </div>
    );
  };

  renderGraph = () => {
    if (!this.isLoadedWithoutError()) {
      return null;
    }

    return (
      <div
        className={`w-100 ${this.state.isShowingList &&
          "w-two-thirds-l"} h-100 fixed right-0 top-0`}
      >
        <Graph
          refEChart={e => {
            this.eChart = e;
          }}
          layout={"force"}
          nodeData={this.getNodeData()}
          edgeData={this.getEdgeData()}
          tooltipPosition={"top"}
          onClick={e => {
            if (e.dataType !== "node") {
              return;
            }
            this.handleSurfaceDetail(e.data.id);
          }}
          onMouseOver={e => {
            if (
              e.dataType !== "node" ||
              (e.data.category === "entity" || e.data.category === "tag")
            ) {
              return;
            }

            let nodes: Array<Node> = [];

            if (!this.props.data) {
              return null;
            }

            if (this.props.data.getAll && this.props.data.getAll.graph.nodes) {
              nodes = this.props.data.getAll.graph.nodes;
            }

            if (nodes.length < 1) {
              return;
            }

            let node = nodes.find(n => {
              return n.id === e.data.id;
            });

            if (node) {
              this.setState({
                hoverFocus: node
              });
            }

            return;
          }}
          onMouseOut={e => {
            return;
          }}
          focusColor1={FOCUS_COLOR_1}
          focusColor2={FOCUS_COLOR_2}
          gradientNumber={this.getGradientNumber()}
          focusNodeAdjacency={false}
          showTooltip={false}
        />
      </div>
    );
  };

  renderDetailBar = () => {
    let nodes: Array<Node> = [];

    if (!this.props.data) {
      return null;
    }

    if (this.props.data.getAll && this.props.data.getAll.graph.nodes) {
      nodes = this.props.data.getAll.graph.nodes;
    }

    nodes = nodes.filter(n => {
      return n.type === "Capture";
    });

    if (nodes.length < 1) {
      return null;
    }

    const node =
      this.state.hoverFocus !== null ? this.state.hoverFocus : nodes[0];

    return (
      <div
        className={`dt w-100 bg-white br4 bt b--light-gray tl ${(!this.state
          .isShowingList ||
          this.state.hoverFocus !== null) &&
          "shadow-1-l measure-l fixed-l bottom-2-l left-2-l"}`}
      >
        <ResultListItem
          key={node.id}
          id={node.id}
          body={node.text}
          onClick={this.handleSurfaceDetail.bind(null, node.id)}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            this.handleFocusNode(node.id);
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            this.handleUnfocusNode();
          }}
          accentColor={config.captureAccentColor}
          baseColor={"gray"}
          isFocus={false}
          showActionBar={this.state.resultOptionsIsOpenMap[node.id]}
          onShowActionBarChange={this.handleResultActionBarChange}
          handleRefetch={this.handleResultListItemRefetch}
        />
        {this.renderHideList()}
      </div>
    );
  };

  render() {
    return (
      <div className={``}>
        {this.renderCaptureCount()}
        {this.renderGraph()}

        {this.state.isShowingList ? (
          <Sidebar
            renderHeader={this.renderCaptureCount}
            renderBody={this.renderResults}
            renderFooter={this.renderHideList}
            scrollToId={
              this.state.hoverFocus ? this.state.hoverFocus.id : undefined
            }
          />
        ) : (
          <div className={`fixed w-100 bottom-0 z-3`}>
            {this.renderDetailBar()}
          </div>
        )}

        <div
          className={`
          ${
            this.state.isCapturing
              ? "w-100 h-100 ma0 pa0"
              : "fixed bottom-2 right-0 mb4 mh2 pa0"
          } bottom-2-l right-2-l ma0-l z-2 pa0-l`}
        >
          <GraphButtons
            handleIsCapturing={this.handleIsCapturing}
            isCapturing={this.state.isCapturing}
            handleRefetch={() => {
              this.props.data && this.props.data.refetch();
            }}
          />
        </div>
      </div>
    );
  }
}

const CaptureWithData = graphql<Response, Props>(QUERY, {
  options: (ownProps: Props) => ({
    variables: {
      timezoneOffset: new Date().getTimezoneOffset() / 60 * -1
    },
    fetchPolicy: "network-only"
  })
})(windowSize(Capture));

export default CaptureWithData;
