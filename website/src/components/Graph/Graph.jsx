// React
import * as React from "react";

// Components
import ReactECharts from "echarts-for-react";

// Config / Utils
import { isEqual } from "lodash";
import config from "../../../data/SiteConfig";

const BLUR_COLOR = "#CCCCCC";
const TAG_COLOR = "#333333";
const ENTITY_COLOR = "#777777";

class Graph extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.nodeData, this.props.nodeData);
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

        // Links
        case "link":
          return {
            id: node.id,
            name: `${node.name}`,
            category: node.category,
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
    return [
      {
        name: `detail`,
        itemStyle: {
          normal: {
            color: config.themeColor
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
      },
      {
        name: "link",
        itemStyle: {
          normal: {
            color: "#FFFFFF"
          }
        }
      }
    ];
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
      tooltip: false,
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
        />
      </div>
    );
  }
}

export default Graph;
