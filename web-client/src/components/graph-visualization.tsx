// React
import * as React from "react";

// Components
import ReactECharts from "echarts-for-react";

// Config / Utils
import config from "../cfg";
import { isEqual } from "lodash";

// Types
import { GraphEvent } from "../types";
import {
  NodeFieldsFragment,
  EdgeFieldsFragment,
  NodeType
} from "../__generated__/types";

const NOT_FOCUS_COLOR = "#CCCCCC";
const TAG_COLOR = "#333333";
const ENTITY_COLOR = "#777777";
const SESSION_COLOR = "#111C77";
const OTHER_COLOR = "#FFFFFF";

const TEXT_COLOR = "#777777";

const FOCUS_TYPE = "focus";
const NOT_FOCUS_TYPE = "not_focus";

interface Props {
  refEChart?: (eChart: ReactECharts) => void;
  nodes: Array<NodeFieldsFragment>;
  edges: Array<EdgeFieldsFragment>;
  onClick: (e: GraphEvent) => void;
  onMouseOver: (e: GraphEvent) => void;
  onMouseOut: (e: GraphEvent) => void;
  showTooltip: boolean;
}

interface State {}

class Graph extends React.Component<Props, State> {
  eChart: ReactECharts | null = null;

  shouldComponentUpdate(nextProps: Props) {
    return !isEqual(nextProps.nodes, this.props.nodes);
  }

  getNodes() {
    return this.props.nodes.map((node, index) => {
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
            symbolSize: 24,
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
            symbolSize: 24,
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
            category: node.level === 0 ? FOCUS_TYPE : NOT_FOCUS_TYPE,
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
    return this.props.edges.map(edge => {
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

  getEvents() {
    return {
      click: this.props.onClick,
      mouseover: this.props.onMouseOver,
      mouseout: this.props.onMouseOut
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
        show: this.props.showTooltip,
        trigger: "item",
        showContent: true,
        confine: true,
        position: "top",
        // formatter: (params: {
        //   dataType: string;
        //   name: string;
        //   data: { category: string };
        // }) => {
        //   switch (params.dataType) {
        //     case "node":
        //       if (
        //         params.data.category === "entity" ||
        //         params.data.category === "tag" ||
        //         params.data.category === "link"
        //       ) {
        //         return "";
        //       }

        //       let lines = params.name.match(/.{1,40}/g);

        //       if (!lines) {
        //         lines = [params.name];
        //       }

        //       let label = lines.reduce((currentLabel, line) => {
        //         return `
        //           ${currentLabel}
        //           <div class="f6 avenir br1 measure" id="node-label">
        //             ${line}
        //           </div>`;
        //       }, "");

        //       return `
        //       <div class="pa2 shadow-1 br1">
        //         ${label}
        //       </div>`;
        //     default:
        //       return "";
        //   }
        // },
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
          focusNodeAdjacency: true,
          cursor: "pointer",
          lineStyle: {
            curveness: 0.3,
            opacity: 0.2,
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
      <ReactECharts
        ref={this.props.refEChart}
        style={{ height: "100%", width: "100%" }}
        option={this.getOption()}
        opts={{ renderer: "canvas" }}
        onEvents={this.getEvents()}
      />
    );
  }
}

export default Graph;
