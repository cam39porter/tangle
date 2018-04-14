// React
import * as React from "react";

// Components
import ReactECharts from "echarts-for-react";

// Config / Utils
import { getGradient } from "../utils";
import tinycolor from "tinycolor2";

const BLUR_COLOR = "#CCCCCC";
const TAG_COLOR = "#333333";
const ENTITY_COLOR = "#777777";

export interface GraphNode {
  id: string;
  name: string;
  category: string;
}

export interface GraphEdge {
  source: string;
  destination: string;
}

interface Props {
  refEChart?: (eChart: ReactECharts) => void;
  focusStartIndex?: number;
  focusEndIndex?: number;
  nodeData: Array<GraphNode>;
  edgeData: Array<GraphEdge>;
  layout?: "circular" | "force";
  tooltipPosition?: Array<String> | String;
  onClick: (
    e: { dataType: string; data: { id: string; category: string } }
  ) => void;
  focusColor1: string;
  focusColor2: string;
  gradientNumber: number;
  focusNodeAdjacency: boolean;
  showTooltip: boolean;
}

class Graph extends React.Component<Props, object> {
  eChart: ReactECharts | null = null;

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.focusStartIndex !== nextProps.focusStartIndex ||
      this.props.focusEndIndex !== nextProps.focusEndIndex
    );
  }

  getNodes() {
    return this.props.nodeData.map((node, index) => {
      switch (node.category) {
        // Entities
        case "entity":
          return {
            id: node.id,
            name: node.name,
            category: node.category,
            symbolSize: 24,
            label: {
              show: true,
              color: ENTITY_COLOR,
              emphasis: {
                show: true
              }
            }
          };

        // Tags
        case "tag":
          return {
            id: node.id,
            name: `#${node.name}`,
            category: node.category,
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

        // Captures
        default:
          return {
            id: node.id,
            name: node.name,
            category: node.category,
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
    return this.props.edgeData.map(edge => {
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
    const baseCategories = [
      {
        name: `detail`,
        itemStyle: {
          normal: {
            color: this.props.focusColor1
          }
        }
      },
      {
        name: "blur",
        itemStyle: {
          normal: {
            color: BLUR_COLOR
          }
        }
      },
      {
        name: "entity",
        itemStyle: {
          normal: {
            color: "#FFFFFF"
          }
        }
      },
      {
        name: "tag",
        itemStyle: {
          normal: {
            color: "#FFFFFF"
          }
        }
      }
    ];

    const gradient = getGradient(
      tinycolor(this.props.focusColor1),
      tinycolor(this.props.focusColor2),
      this.props.gradientNumber
    );

    return gradient
      .map((color, index) => {
        return {
          name: `${index}focus`,
          itemStyle: {
            normal: {
              color: color.toHexString()
            }
          }
        };
      })
      .concat(baseCategories);
  }

  getEvents() {
    return {
      click: this.props.onClick
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
        position: this.props.tooltipPosition
          ? this.props.tooltipPosition
          : "top",
        formatter: (params: {
          dataType: string;
          name: string;
          data: { category: string };
        }) => {
          switch (params.dataType) {
            case "node":
              if (
                params.data.category === "entity" ||
                params.data.category === "tag"
              ) {
                return "";
              }

              let lines = params.name.match(/.{1,40}/g);

              if (!lines) {
                lines = [params.name];
              }

              let label = lines.reduce((currentLabel, line) => {
                return `
                  ${currentLabel}
                  <div class="f6 avenir br1 measure" id="node-label">
                    ${line}
                  </div>`;
              }, "");

              return `
              <div class="pa2 shadow-1 br1">
                ${label}
              </div>`;
            default:
              return "";
          }
        },
        backgroundColor: "#FFFFFF",
        textStyle: {
          color: "#777777"
        }
      },
      series: [
        {
          type: "graph",
          id: "network-id",
          name: "network-name",
          legendHoverLink: false,
          coordinateSystem: null,
          xAxisIndex: 0,
          yAxisIndex: 0,
          polarIndex: 0,
          geoIndex: 0,
          calendarIndex: 0,
          hoverAnimation: false,
          layout: this.props.layout || "force",
          circular: {
            rotateLabel: false
          },
          force: {
            edgeLength: 50,
            repulsion: 600,
            gravity: 0.2,
            layoutAnimation: true
          },
          roam: true,
          nodeScaleRation: 0.5,
          draggable: false,
          focusNodeAdjacency: this.props.focusNodeAdjacency,
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
      <div className={`w-100 h-100`}>
        <ReactECharts
          ref={this.props.refEChart}
          style={{ height: "100%", width: "100%" }}
          option={this.getOption()}
          opts={{ renderer: "canvas" }}
          onEvents={this.getEvents()}
        />
      </div>
    );
  }
}

export default Graph;
