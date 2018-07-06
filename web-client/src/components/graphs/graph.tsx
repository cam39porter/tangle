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
import { isEqual, uniqBy } from "lodash";
import windowSize from "react-window-size";
import { AnalyticsUtils } from "../../utils/index";

// Types
import { GraphEvent } from "../../types";
import {
  NodeFieldsFragment,
  EdgeFieldsFragment,
  NodeType
} from "../../__generated__/types";

const NOT_FOCUS_COLOR = "#CCCCCC";
const TAG_COLOR = "#333333";
const ENTITY_COLOR = "#555555";
const SESSION_COLOR = "#111C77";
const OTHER_COLOR = "#F4F4F4";

const TEXT_COLOR = "#777777";

const FOCUS_TYPE = "focus";
const NOT_FOCUS_TYPE = "not_focus";

const WIDTH = "30em";

interface Props extends RouteComponentProps<{}> {
  refEChart?: (eChart: ReactEchartsCore) => void;
  nodes: Array<NodeFieldsFragment>;
  edges: Array<EdgeFieldsFragment>;
  headerHeight: number;
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {
  graphFocus: GraphEvent | null;
  nodes: Array<NodeFieldsFragment>;
  edges: Array<EdgeFieldsFragment>;
}

const filterDuplicateNodes = (nodes: Array<NodeFieldsFragment>) =>
  uniqBy(nodes, "id");

class GraphVisualization extends React.Component<Props, State> {
  eChart: ReactEchartsCore | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      graphFocus: null,
      nodes: filterDuplicateNodes(props.nodes),
      edges: props.edges
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.location.pathname !== nextProps.location.pathname ||
      this.props.location.search !== nextProps.location.search
    ) {
      this.setState({
        graphFocus: null,
        nodes: filterDuplicateNodes(nextProps.nodes),
        edges: nextProps.edges
      });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      !isEqual(nextProps.nodes, this.props.nodes) ||
      !isEqual(nextProps.edges, this.props.edges)
    ) {
      return true;
    }

    if (this.state.graphFocus === null && nextState.graphFocus !== null) {
      return true;
    }
    if (this.state.graphFocus !== null && nextState.graphFocus === null) {
      return true;
    }
    if (this.state.graphFocus !== null && nextState.graphFocus !== null) {
      if (this.state.graphFocus.data.id !== nextState.graphFocus.data.id) {
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
          return {
            id: node.id,
            name: node.text,
            category: NodeType.Capture, // node.level === 0 ? FOCUS_TYPE : NOT_FOCUS_TYPE,
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
        name: NodeType.Capture,
        itemStyle: {
          normal: {
            color: config.accentColor
          }
        }
      },
      {
        name: FOCUS_TYPE,
        itemStyle: {
          normal: {
            color: config.accentColor
          }
        }
      },
      {
        name: NOT_FOCUS_TYPE,
        itemStyle: {
          normal: {
            color: NOT_FOCUS_COLOR
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
      },
      {
        name: NodeType.Session,
        itemStyle: {
          normal: {
            color: SESSION_COLOR
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
              action: AnalyticsUtils.Actions.FocusOnCapture,
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
          case NodeType.Capture:
            // TODO: get sessions this is a part of and if it is a part of the current session notify the user
            this.setState({ graphFocus: e }, () => {
              AnalyticsUtils.trackEvent({
                category: this.props.match.params["id"]
                  ? AnalyticsUtils.Categories.Session
                  : AnalyticsUtils.Categories.Home,
                action: AnalyticsUtils.Actions.FocusOnCapture,
                label: e.data.id
              });
            });
            return;
          case NodeType.Session:
            this.props.history.push(
              `/collection/${e.data.id}/format/graph/related`
            );
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.FocusOnSession,
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
              return `
              <div class="pa1 ph3 shadow-1 br4 bg-white f5 dark-gray">
                <p>
                  ${e.data.name}
                </p>
              </div>`;

            case NodeType.Capture:
              let lines = e.data.name.match(/.{1,67}/g);
              if (!lines) {
                lines = [e.data.name];
              }
              let preview = lines[0].replace(/\r?\n|\r/g, "");
              if (lines.length > 1) {
                preview = preview + "...";
              }
              return `
              <div class="pa1 ph3 shadow-1 br4 bg-white f6 dark-gray">
                ${preview}
              </div>`;
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
    return (
      <div
        className={`vh-100`}
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
        {this.state.graphFocus &&
          this.state.graphFocus.data.id && (
            <div
              className={`absolute bottom-1 left-1 z-5 br4`}
              style={{ width: WIDTH }}
            >
              <CardCapture
                captureId={this.state.graphFocus.data.id}
                startingText={this.state.graphFocus.data.name}
              />
            </div>
          )}
      </div>
    );
  }
}

const GraphWithData = windowSize(withRouter(GraphVisualization));

export default GraphWithData;
