// React
import * as React from "react";
import * as ReactDOM from "react-dom";

// GraphQL
import {
  SearchQuery as Response,
  NodeType,
  EdgeType
} from "../__generated__/types";
import { Search as QUERY } from "../queries";
import { graphql, ChildProps } from "react-apollo";

// Router
import { RouteComponentProps } from "react-router";

// Components
import ResultListItem from "../components/result-list-item";
import Graph from "../components/graph";
import { GraphNode } from "../components/graph";
import Sidebar from "../components/sidebar";
import SidebarSectionHeader from "../components/sidebar-section-header";
import ScrollContainerElement from "../components/scroll-container-element";

// Config / Utils
import config from "../cfg";
import qs from "qs";
import { assign, mapKeys } from "lodash";
import { X } from "react-feather";
import windowSize from "react-window-size";

const COUNT = 5; // number of results to return

const FOCUS_COLOR_1 = "#A463F2";
const FOCUS_COLOR_2 = "#CDECFF";

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
  query: string;
  focusStartIndex: number;
  isSearch: boolean;
  isDetail: boolean;
  isShowingList: boolean;
  isCapturing: boolean;
  hoverFocus: Node | null;
  nodeIdToIndex: Object;
  resultOptionsIsOpenMap: Object;
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
      isShowingList: false,
      isCapturing: false,
      hoverFocus: null,
      nodeIdToIndex: {},
      resultOptionsIsOpenMap: {}
    };
  }

  componentDidMount() {
    this.setState({
      isShowingList: this.isLargeWindow()
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    let nextState = {};

    // update current query
    const query = getQuery(this.props.location.search);
    const nextQuery = getQuery(nextProps.location.search);
    if (nextQuery !== query) {
      const isSearch = nextQuery.length !== 0;
      nextState = assign(nextState, {
        query: nextQuery,
        focusStartIndex: 0,
        isSearch
      });
    }

    // update is detail view
    const id = getId(nextProps.location.search);
    const isDetail = id.length !== 0;
    nextState = assign(nextState, { id, isDetail });

    // update mappings
    let nextResultOptionsIsOpenMap = [];
    let nextNodeIdToIndex = {};
    let nodes: Array<Node> = [];
    if (nextProps.data) {
      if (nextProps.data.search && nextProps.data.search.graph.nodes) {
        nodes = nextProps.data.search.graph.nodes;
      }
      if (nextProps.data.get && nextProps.data.get.nodes) {
        nodes = nextProps.data.get.nodes;
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
    if (this.state.id === id) {
      this.handleSurface();
      return;
    }

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

  handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const query = e.currentTarget.value;

    this.setState({
      query
    });
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.handleSurface(this.state.query);
    }
  };

  handleSurface = (query?: string) => {
    this.setState(
      {
        isShowingList: false,
        isDetail: false,
        isSearch: query ? true : false,
        hoverFocus: null
      },
      () => {
        this.handleFocusInput(false);
      }
    );

    this.props.history.push(
      `/surface?query=${encodeURIComponent(query || "")}`
    );
  };

  handleSurfaceDetail = (id: string) => {
    this.setState({
      hoverFocus: null
    });

    this.props.history.push(
      `/surface?query=${encodeURIComponent(
        this.state.query || ""
      )}&id=${encodeURIComponent(id)}`
    );
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
    if (!(this.props.data && this.props.data.search)) {
      return 2;
    }

    let resultCount = this.props.data.search.graph.nodes.reduce(
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

    if (this.props.data.search) {
      nodes = this.props.data.search.graph.nodes;
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

        // Links
        case NodeType.Link:
          return {
            id: node.id,
            name: node.text,
            category: "link"
          };

        // Captures
        default:
          let graphNode = {
            id: node.id,
            name: node.text,
            category: `blur`
          };

          if (node.level === 0) {
            graphNode = assign(graphNode, {
              id: node.id,
              name: node.text,
              category: `detail`
            });
          }

          return graphNode;
      }
    });
  };

  getEdgeData = (): Array<{ source: string; destination: string }> => {
    if (!this.props.data) {
      return [];
    }

    let edges: Array<Edge> = [];

    if (this.props.data.search) {
      edges = this.props.data.search.graph.edges;
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
  };

  renderSearchBar = () => {
    return (
      <div>
        <div
          className={`fixed top-1 ph2 w-100 top-2-l center w-third-l dt pv0-l ph4-l z-5`}
          style={{ cursor: "text", minHeight: "3rem", maxHeight: "3rem" }}
          onClick={() => {
            if (this.searchInput) {
              this.searchInput.focus();
            }
          }}
        >
          <div
            className={`relative w-100 ph1 dtc v-mid tc bg-white br4 bb bw1 b--${
              config.surfaceAccentColor
            } shadow-1`}
          >
            <input
              className={`pv2 ph3 f6 fl w-80`}
              ref={input => {
                this.searchInput = input;
              }}
              value={this.state.query || ""}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              placeholder={"What are you looking for..."}
              autoFocus={false}
              onFocus={e => {
                // focus on the end value in the input
                var tempValue = e.target.value;
                e.target.value = "";
                e.target.value = tempValue;
              }}
            />
            {this.state.isSearch || this.state.isDetail ? (
              <div
                className={`absolute right-0 h-100 w3 gray pt1 tc pointer`}
                onClick={() => {
                  this.handleSurface();
                }}
              >
                <X size={20} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  renderResults = (nodes?: Array<Node>) => {
    if (!this.isLoadedWithoutError) {
      return null;
    }

    if (nodes === undefined) {
      if (!(this.props.data && this.props.data.search)) {
        return null;
      }
      nodes = this.props.data.search.graph.nodes;
    }

    let topCaptures: Array<Node> = [];
    let relatedCaptures: Array<Node> = [];

    nodes.forEach(node => {
      if (node.type === "Capture") {
        if (node.level === 0) {
          topCaptures = topCaptures.concat(node);
        } else {
          relatedCaptures = relatedCaptures.concat(node);
        }
      }
    });

    return (
      <div>
        {topCaptures.length > 0 && (
          <SidebarSectionHeader title={"top captures"} />
        )}
        {topCaptures.map((capture, index) => {
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
                accentColor={config.surfaceAccentColor}
                baseColor={config.surfaceBaseColor}
                textColor={"white"}
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
        {relatedCaptures.length > 0 && (
          <SidebarSectionHeader title={"related captures"} />
        )}
        {relatedCaptures.map((capture, index) => {
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
                accentColor={config.surfaceAccentColor}
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

  renderDetail = () => {
    if (!(this.props.data && this.props.data.get)) {
      return null;
    }

    let detailNodes: Array<Node> = [];

    const captureNodes = this.props.data.get.nodes.filter(node => {
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
        <SidebarSectionHeader
          title={
            detailNodes.length === 1 ? "detail capture" : "connected captures"
          }
        />
        {detailNodes !== undefined
          ? detailNodes.map(detailNode => {
              return (
                <ScrollContainerElement
                  key={detailNode.id}
                  name={detailNode.id}
                >
                  <ResultListItem
                    key={detailNode.id}
                    id={detailNode.id}
                    body={detailNode.text}
                    onClick={this.handleSurfaceDetail.bind(null, detailNode.id)}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      this.handleFocusNode(detailNode.id);
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      this.handleUnfocusNode();
                    }}
                    accentColor={config.surfaceAccentColor}
                    baseColor={config.surfaceBaseColor}
                    textColor={"near-white"}
                    isFocus={
                      (this.isLargeWindow() &&
                        (this.state.hoverFocus &&
                          this.state.hoverFocus.id === detailNode.id)) === true
                    }
                    showActionBar={
                      this.state.resultOptionsIsOpenMap[detailNode.id]
                    }
                    onShowActionBarChange={this.handleResultActionBarChange}
                    handleRefetch={this.handleResultListItemRefetch}
                  />
                </ScrollContainerElement>
              );
            })
          : null}
        {this.renderResults(captureNodes)}
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
        className={`w-100 ${(this.state.isDetail || this.state.isSearch) &&
          this.state.isShowingList &&
          "w-two-thirds-l"} h-100 fixed right-0 top-0`}
      >
        <Graph
          refEChart={e => {
            this.eChart = e;
          }}
          layout={"force"}
          nodeData={this.getNodeData()}
          edgeData={this.getEdgeData()}
          tooltipPosition={this.state.isSearch ? ["32", "32"] : "top"}
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

            if (this.props.data.search && this.props.data.search.graph.nodes) {
              nodes = this.props.data.search.graph.nodes;
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

    if (this.props.data.get) {
      nodes = this.props.data.get.nodes;
    }

    if (this.props.data.search && this.props.data.search.graph.nodes) {
      nodes = this.props.data.search.graph.nodes;
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
      <div>
        <div
          className={`dt w-100 bg-white br4 bt b--light-gray tl ${(!this.state
            .isShowingList ||
            this.state.hoverFocus !== null ||
            (!this.state.isSearch || !this.state.isDetail)) &&
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
            accentColor={config.surfaceAccentColor}
            baseColor={"gray"}
            isFocus={false}
            maxHeight={this.isLargeWindow() ? undefined : "4rem"}
            showActionBar={this.state.resultOptionsIsOpenMap[node.id]}
            onShowActionBarChange={this.handleResultActionBarChange}
            handleRefetch={this.handleResultListItemRefetch}
          />
          {this.renderHideList()}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={``}>
        {this.renderSearchBar()}
        {this.renderGraph()}

        {this.state.isShowingList ? (
          <Sidebar
            renderHeader={this.renderSearchBar}
            renderBody={
              !this.state.isDetail
                ? this.renderResults.bind(this)
                : this.renderDetail.bind(this)
            }
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
      </div>
    );
  }
}

const SurfaceResultsWithData = graphql<Response, Props>(QUERY, {
  options: (ownProps: Props) => ({
    variables: {
      query: getQuery(ownProps.location.search),
      count: COUNT,
      detailId: getId(ownProps.location.search),
      isDetail: getId(ownProps.location.search).length > 0
    },
    fetchPolicy: "network-only"
  })
})(windowSize(Surface));

export default SurfaceResultsWithData;
