// React
import * as React from "react";

// Components
import ReactECharts from "echarts-for-react";

export interface Node {
  id: string;
  name: string;
  category: string;
}

export interface Edge {
  source: string;
  target: string;
}

interface Props {
  refEChart?: (eChart: ReactECharts) => void;
  focusStartIndex?: number;
  focusEndIndex?: number;
  nodeData: Array<Node>;
  edgeData: Array<Edge>;
  categoryData: Array<Object>;
  layout?: "circular" | "force";
  tooltipPosition?: Array<String> | String;
  onClick: (
    e: { dataType: string; data: { id: string; category: string } }
  ) => void;
}

class Graph extends React.Component<Props, object> {
  eChart: ReactECharts | null = null;

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.focusStartIndex !== nextProps.focusStartIndex ||
      this.props.focusEndIndex !== nextProps.focusEndIndex
    );
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
        show: true,
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
          focusNodeAdjacency: true,
          cursor: "pointer",
          lineStyle: {
            curveness: 0.3,
            opacity: 0.1,
            type: "solid"
          },
          categories: this.props.categoryData,
          nodes: this.props.nodeData,
          edges: this.props.edgeData,
          animation: false,
          notMerge: false
        }
      ]
    };
  }

  render() {
    return (
      <div className={`flex-column flex-grow`}>
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
