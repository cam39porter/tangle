// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// Components
import ReactEchartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/chart/graph";

import CardCapture from "../cards/card-capture";

// Config / Utils
import config from "../../cfg";
import { isEqual, uniqBy, findIndex } from "lodash";
import windowSize from "react-window-size";
import { AnalyticsUtils } from "../../utils/index";

// Types
import { GraphEvent } from "../../types";
import {
  NodeFields,
  EdgeFields,
  NodeType,
  ResultClass
} from "../../__generated__/types";

const RELATED_COLOR = "#CCCCCC";
const TAG_COLOR = "#333333";
const ENTITY_COLOR = "#555555";
const OTHER_COLOR = "#F4F4F4";

const TEXT_COLOR = "#777777";

const WIDTH = "30em";

interface Props extends RouteComponentProps<{}> {
  refEChart?: (eChart: ReactEchartsCore) => void;
  nodes: Array<NodeFields>;
  edges: Array<EdgeFields>;
  headerHeight: number;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {
  focusNode: NodeFields | null;
  nodes: Array<NodeFields>;
  edges: Array<EdgeFields>;
  currentSessionId?: string;
}

const filterDuplicateNodes = (nodes: Array<NodeFields>) => uniqBy(nodes, "id");

class GraphVisualization extends React.Component<Props, State> {
  eChart: ReactEchartsCore | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      focusNode: null,
      nodes: filterDuplicateNodes(props.nodes),
      edges: props.edges,
      currentSessionId: decodeURIComponent(this.props.match.params["id"])
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { focusNode } = this.state;
    let focusNodeIndex = -1;
    if (focusNode !== null) {
      focusNodeIndex = findIndex(
        nextProps.nodes,
        node => node.id === focusNode.id
      );
    }

    this.setState({
      focusNode: focusNodeIndex === -1 ? null : focusNode,
      nodes: filterDuplicateNodes(nextProps.nodes),
      edges: nextProps.edges,
      currentSessionId: decodeURIComponent(this.props.match.params["id"])
    });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      !isEqual(nextProps.nodes, this.props.nodes) ||
      !isEqual(nextProps.edges, this.props.edges)
    ) {
      return true;
    }

    if (this.state.focusNode === null && nextState.focusNode !== null) {
      return true;
    }
    if (this.state.focusNode !== null && nextState.focusNode === null) {
      return true;
    }
    if (this.state.focusNode !== null && nextState.focusNode !== null) {
      if (this.state.focusNode.id !== nextState.focusNode.id) {
        return true;
      }
    }

    return false;
  }

  getNodes() {
    return this.state.nodes.map(node => {
      switch (node.type) {
        // Entities
        case NodeType.Entity:
          return {
            id: node.id,
            name: node.text,
            category: node.type,
            symbolSize: 36,
            label: {
              show: true,
              color: ENTITY_COLOR,
              emphasis: {
                show: true
              }
            }
          };

        // Tags
        case NodeType.Tag:
          return {
            id: node.id,
            name: `#${node.text}`,
            category: node.type,
            symbolSize: 36,
            label: {
              show: true,
              color: TAG_COLOR,
              fontSize: 12,
              fontWeight: "bold",
              emphasis: {
                show: true
              }
            }
          };

        // Links
        case NodeType.Link:
          return {
            id: node.id,
            name: `${node.text}`,
            category: node.type,
            symbolSize: 36,
            label: {
              show: true,
              color: TAG_COLOR,
              fontSize: 12,
              emphasis: {
                show: true
              }
            }
          };

        // Sessions
        case NodeType.Session:
          return {
            id: node.id,
            name: `${node.text}`,
            category: node.type,
            symbolSize: 24,
            label: {
              show: false,
              emphasis: {
                show: false
              }
            }
          };

        // Captures
        default:
          const sessionParents = node.parents;
          if (
            sessionParents &&
            sessionParents.length > 0 &&
            sessionParents[0].id === this.state.currentSessionId
          ) {
            return {
              id: node.id,
              name: node.text,
              category: NodeType.Session,
              symbolSize: 24,
              label: {
                show: false,
                emphasis: {
                  show: false
                }
              }
            };
          }
          return {
            id: node.id,
            name: node.text,
            category: node.resultClass,
            symbolSize: 24,
            label: {
              show: false,
              emphasis: {
                show: false
              }
            }
          };
      }
    });
  }

  getEdges() {
    return this.state.edges.map(edge => {
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

  getCategories() {
    return [
      {
        name: NodeType.Session,
        itemStyle: {
          normal: {
            color: config.baseColor
          }
        }
      },
      {
        name: ResultClass.DIRECT_RESULT,
        itemStyle: {
          normal: {
            color: config.accentColor
          }
        }
      },
      {
        name: ResultClass.RELATED,
        itemStyle: {
          normal: {
            color: RELATED_COLOR
          }
        }
      },
      {
        name: NodeType.Entity,
        itemStyle: {
          normal: {
            color: OTHER_COLOR
          }
        }
      },
      {
        name: NodeType.Tag,
        itemStyle: {
          normal: {
            color: OTHER_COLOR
          }
        }
      },
      {
        name: NodeType.Link,
        itemStyle: {
          normal: {
            color: OTHER_COLOR
          }
        }
      }
    ];
  }

  search = (e: GraphEvent) => {
    const query = e.data.name;

    const path = this.props.location.pathname;
    const splitPath = path.split("/");
    splitPath.pop();
    splitPath.push(`search?query=${encodeURIComponent(query)}`);
    this.props.history.push(`${splitPath.join("/")}`);
  };

  setFocusNode = (e: GraphEvent) => {
    const nextFocusNode = this.props.nodes.find(node => node.id === e.data.id);
    this.setState({
      focusNode: nextFocusNode ? nextFocusNode : null
    });
  };

  getEvents() {
    return {
      click: (e: GraphEvent) => {
        switch (e.data.category) {
          case NodeType.Tag:
            this.search(e);
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.FocusOnTag,
              label: e.data.id
            });
            return;
          case NodeType.Entity:
            this.search(e);
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.FocusOnEntity,
              label: e.data.id
            });
            return;
          case ResultClass.DIRECT_RESULT:
            this.setFocusNode(e);
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.FocusOnDirectResultCapture,
              label: e.data.id
            });
            return;
          case ResultClass.RELATED:
            this.setFocusNode(e);
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.FocusOnRelatedCapture,
              label: e.data.id
            });
            return;
          case NodeType.Session:
            this.setFocusNode(e);
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.FocusOnSessionCapture,
              label: e.data.id
            });
            return;
          default:
            return;
        }
      }
      // mouseover: this.props.onMouseOver,
      // mouseout: this.props.onMouseOut
    };
  }

  renderTooltip = (e: GraphEvent) => {
    const text = e.data.name.replace(/<[^>]*>/g, "");
    let lines = text.match(/.{1,67}/g);
    if (!lines) {
      lines = [text];
    }
    let preview = lines[0].replace(/\r?\n|\r/g, "");
    if (lines.length > 1) {
      preview = preview + "...";
    }
    return `
  <div class="pa3 shadow-1 br4 bg-white f6 dark-gray">
    ${preview}
  </div>`;
  };

  getOption() {
    return {
      title: {
        show: false
      },
      legend: {
        show: false
      },
      toolbox: {
        show: false
      },
      tooltip: {
        show: true,
        trigger: "item",
        showContent: true,
        confine: true,
        position: "top",
        formatter: (e: GraphEvent) => {
          switch (e.data.category) {
            case NodeType.Session:
              return this.renderTooltip(e);
            case ResultClass.DIRECT_RESULT:
              return this.renderTooltip(e);
            case ResultClass.RELATED:
              return this.renderTooltip(e);
            default:
              return "";
          }
        },
        backgroundColor: OTHER_COLOR,
        textStyle: {
          color: TEXT_COLOR
        }
      },
      series: [
        {
          type: "graph",
          id: "tangle-visualization",
          name: "tangle",
          legendHoverLink: false,
          coordinateSystem: null,
          xAxisIndex: 0,
          yAxisIndex: 0,
          polarIndex: 0,
          geoIndex: 0,
          calendarIndex: 0,
          hoverAnimation: true,
          layout: "force",
          circular: {
            rotateLabel: false
          },
          force: {
            edgeLength: 50,
            repulsion: 600,
            gravity: 0.2,
            layoutAnimation: true
          },
          roam: "move",
          draggable: false,
          focusNodeAdjacency: false,
          cursor: "pointer",
          lineStyle: {
            curveness: 0.3,
            opacity: 0.3,
            type: "solid"
          },
          categories: this.getCategories(),
          nodes: this.getNodes(),
          edges: this.getEdges(),
          animation: false,
          notMerge: false
        }
      ]
    };
  }

  render() {
    const { focusNode } = this.state;

    return (
      <div
        className={`relative vh-100`}
        style={
          {
            // minHeight: `${this.props.windowHeight - this.props.headerHeight}px`
          }
        }
      >
        <ReactEchartsCore
          echarts={echarts}
          ref={this.props.refEChart}
          style={{ height: "100%", width: "100%" }}
          option={this.getOption()}
          opts={{ renderer: "canvas" }}
          onEvents={this.getEvents()}
        />
        {focusNode && (
          <div className={`absolute relative top-1 left-1 z-5`}>
            <div
              className={`absolute top-1 right-1 pa2 pointer ba br4 f7 bg-white b--accent accent`}
              style={{ userSelect: "none" }}
              onClick={() => {
                this.setState({ focusNode: null });
              }}
            >
              Hide
            </div>
            <CardCapture
              captureId={focusNode.id}
              startingHtml={focusNode.text || ""}
              sessionParents={focusNode.parents}
              authorName={null}
            />
          </div>
        )}
      </div>
    );
  }
}

const GraphWithData = windowSize(withRouter(GraphVisualization));

export default GraphWithData;
