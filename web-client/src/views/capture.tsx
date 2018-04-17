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
import ResultDetail from "../components/result-detail";
import Graph from "../components/graph";
import { GraphNode } from "../components/graph";
import GraphButtons from "../components/graph-buttons";
import Sidebar from "../components/sidebar";

// Config / Utils
import config from "../cfg";
import qs from "qs";
import { assign } from "lodash";
// import { X } from "react-feather";
import windowSize from "react-window-size";

const FOCUS_COLOR_1 = "#19A974";
const FOCUS_COLOR_2 = "#9EEBCF";

interface Node {
  __typename: "Node";
  id: string;
  type: NodeType;
  text: string;
  level: number;
}

interface Edge {
  __typename: "Edge";
  source: string;
  destination: string;
  type: EdgeType;
  salience: number | null;
}

interface InputProps {
  query: string;
}

interface RouteProps extends RouteComponentProps<InputProps> {}

interface Props extends RouteProps, ChildProps<InputProps, Response> {
  windowWidth: number;
  windowHeight: number;
}

interface State {
  id: string;
  isDetail: boolean;
  isShowingList: boolean;
  isCapturing: boolean;
  hoverFocus: Node | null;
  nodeIdToIndex: Object;
}

function getId(queryString: string) {
  return (
    qs.parse(queryString, {
      ignoreQueryPrefix: true
    }).id || ""
  );
}

class Capture extends React.Component<Props, State> {
  // eChart instance ref for dispatching events
  eChart;

  searchInput: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);

    this.handleIsShowingList = this.handleIsShowingList.bind(this);
    this.handleIsCapturing = this.handleIsCapturing.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSurfaceDetail = this.handleSurfaceDetail.bind(this);
    this.handleFocusInput = this.handleFocusInput.bind(this);

    this.renderCaptureCount = this.renderCaptureCount.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.renderDetail = this.renderDetail.bind(this);
    this.renderHideList = this.renderHideList.bind(this);

    const id = getId(this.props.location.search);
    const isDetail = id.length !== 0;

    this.state = {
      id,
      isDetail,
      isShowingList: false,
      isCapturing: false,
      hoverFocus: null,
      nodeIdToIndex: {}
    };
  }

  componentDidMount() {
    this.setState({
      isShowingList: this.isLargeWindow()
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    let nextState = {};

    // update window size
    if (this.props.windowWidth !== 0) {
      nextState = assign(nextState, { isShowingList: this.isLargeWindow() });
    }

    // update is detail view
    const id = getId(nextProps.location.search);
    const isDetail = id.length !== 0;
    nextState = assign(nextState, { id, isDetail });

    // update mapping of node ids to index
    let nextNodeIdToIndex = {};
    let nodes: Array<Node> = [];
    if (nextProps.data) {
      if (nextProps.data.getAll && nextProps.data.getAll.graph.nodes) {
        nodes = nextProps.data.getAll.graph.nodes;
      }
      if (nextProps.data.get && nextProps.data.get.nodes) {
        nodes = nextProps.data.get.nodes;
      }
    }
    nodes.forEach((node, index) => {
      nextNodeIdToIndex[node.id] = index;
    });
    nextState = assign({ nodeIdToIndex: nextNodeIdToIndex }, nextState);

    // update state
    this.setState(nextState);
  }

  handleIsShowingList() {
    this.setState({
      isShowingList: !this.state.isShowingList
    });
  }

  handleIsCapturing() {
    this.setState({
      isCapturing: !this.state.isCapturing
    });
  }

  handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      //
    }
  }

  handleSurfaceDetail(id: string) {
    this.props.history.push(`/capture?id=${id}`);
    this.handleUnfocusNode();
  }

  handleFocusNode(id: string) {
    if (this.eChart) {
      const eChartInstance = this.eChart.getEchartsInstance();

      eChartInstance.dispatchAction({
        type: "focusNodeAdjacency",
        dataIndex: this.state.nodeIdToIndex[id]
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

  handleFocusInput(shouldFocus: boolean) {
    const input = ReactDOM.findDOMNode(this).querySelector("input");

    if (input) {
      shouldFocus ? input.focus() : input.blur();
    }
  }

  isLargeWindow() {
    return this.props.windowWidth >= 1024;
  }

  isLoadedWithoutError() {
    return (
      this.props.data &&
      this.props.data.loading === false &&
      this.props.data.error === undefined
    );
  }

  getGradientNumber() {
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
  }

  getNodeData(): Array<GraphNode> {
    if (!this.props.data) {
      return [];
    }

    let nodes: Array<Node> = [];

    if (this.props.data.getAll) {
      nodes = this.props.data.getAll.graph.nodes;
    }

    if (this.props.data.get) {
      nodes = this.props.data.get.nodes;
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
          if (this.state.isDetail && node.level === 0) {
            return {
              id: node.id,
              name: node.text,
              category: "detail"
            };
          }

          if (!this.state.isDetail) {
            return {
              id: node.id,
              name: node.text,
              category: `${index}focus`
            };
          }

          return {
            id: node.id,
            name: node.text,
            category: `blur`
          };
      }
    });
  }

  getEdgeData(): Array<{ source: string; destination: string }> {
    if (!this.props.data) {
      return [];
    }

    let edges: Array<Edge> = [];

    if (this.props.data.getAll) {
      edges = this.props.data.getAll.graph.edges;
    }

    if (this.props.data.get) {
      edges = this.props.data.get.edges;
    }

    return edges.map(edge => {
      return {
        source: edge.source,
        destination: edge.destination
      };
    });
  }

  renderCaptureCount() {
    return (
      <div
        className={`fixed top-2-l center w-100 w-third-l dt pa3 pv0-l ph4-l z-999 pointer`}
      >
        <div
          className={`w-100 f6 h2 pa3 dtc v-mid tc gray bg-white br1 bb bw1 b--${
            config.captureAccentColor
          } shadow-1`}
        >
          {`You have made ${"10"} captures so far today!`}
        </div>
      </div>
    );
  }

  renderResults(nodes?: Array<Node>) {
    if (!this.isLoadedWithoutError) {
      return null;
    }

    if (nodes === undefined) {
      if (!(this.props.data && this.props.data.getAll)) {
        return null;
      }
      nodes = this.props.data.getAll.graph.nodes;
    }

    return (
      <div>
        {nodes
          .filter((node, index) => {
            return node.type === "Capture";
          })
          .map((capture, index) => {
            return (
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
                isFocus={
                  (this.isLargeWindow() &&
                    (this.state.hoverFocus &&
                      this.state.hoverFocus.id === capture.id)) === true
                }
              />
            );
          })}
      </div>
    );
  }

  renderDetail() {
    if (!(this.props.data && this.props.data.get)) {
      return null;
    }

    let detailNode;

    const captureNodes = this.props.data.get.nodes.filter(node => {
      if (node.type === "Capture") {
        if (node.level === 0) {
          detailNode = node;
          return false;
        }
        return true;
      }
      return false;
    });

    return (
      <div>
        {detailNode !== undefined ? (
          <ResultDetail
            id={this.state.id}
            body={detailNode.text}
            backgroundColor={config.captureBaseColor}
          />
        ) : null}
        {this.renderResults(captureNodes)}
      </div>
    );
  }

  renderHideList() {
    return (
      <div
        className={`dt w-100 bg-white pointer`}
        onClick={this.handleIsShowingList}
      >
        <div className={`dtc v-mid w-100 h2 pa3 ttu f6 gray`}>
          {this.state.isDetail ? "hide detail" : "hide list"}
        </div>
      </div>
    );
  }

  renderGraph() {
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

            if (this.props.data.get) {
              nodes = this.props.data.get.nodes;
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
            this.setState({
              hoverFocus: null
            });
          }}
          focusColor1={FOCUS_COLOR_1}
          focusColor2={FOCUS_COLOR_2}
          gradientNumber={this.getGradientNumber()}
          focusNodeAdjacency={false}
          showTooltip={false}
        />
      </div>
    );
  }

  renderDetailBar() {
    let nodes: Array<Node> = [];

    if (!this.props.data) {
      return null;
    }

    if (this.props.data.get) {
      nodes = this.props.data.get.nodes;
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
        className={`dt w-100 bg-white pointer bt b--light-gray tl ${(!this.state
          .isShowingList ||
          this.state.hoverFocus !== null) &&
          "shadow-1-l measure-l fixed-l bottom-2-l left-2-l"}`}
      >
        <ResultListItem
          key={node.id}
          id={node.id}
          body={node.text}
          onClick={this.handleIsShowingList}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            this.handleFocusNode(node.id);
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            this.handleUnfocusNode();
          }}
          accentColor={config.captureAccentColor}
          isFocus={false}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={``}>
        {this.renderCaptureCount()}
        {this.renderGraph()}

        {this.state.isShowingList ? (
          <Sidebar
            renderHeader={this.renderCaptureCount}
            renderBody={
              !this.state.isDetail
                ? this.renderResults.bind(this)
                : this.renderDetail.bind(this)
            }
            renderFooter={this.renderHideList}
          />
        ) : (
          <div className={`fixed w-100 bottom-0 z-3`}>
            {this.renderDetailBar()}
          </div>
        )}

        {/* this.state.hoverFocus ? (
          <div className={`fixed w-100 bottom-0 z-3`}>
            {this.renderDetailBar()}
          </div>
        ) : null} */}

        <div
          className={`
          ${this.state.isDetail ? "mb5 pb4" : ""}
          ${
            this.state.isCapturing
              ? "w-100 h-100 ma0 pa0"
              : "fixed bottom-2 right-0 mb4 mh2 pa0"
          } bottom-2-l right-2-l ma0-l z-2 pa0-l`}
        >
          <GraphButtons
            handleIsCapturing={this.handleIsCapturing}
            isCapturing={this.state.isCapturing}
          />
        </div>
      </div>
    );
  }
}

const CaptureWithData = graphql<Response, Props>(QUERY, {
  options: (ownProps: Props) => ({
    variables: {
      timeOffset: 0,
      detailId: getId(ownProps.location.search),
      isDetail: getId(ownProps.location.search).length > 0
    },
    fetchPolicy: "network-only"
  })
})(windowSize(Capture));

export default CaptureWithData;
