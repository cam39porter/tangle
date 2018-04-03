import * as React from "react";

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
}

class Graph extends React.Component<Props, object> {
  eChart: ReactECharts | null = null;

  constructor(props: Props) {
    super(props);

    this.getOption = this.getOption.bind(this);
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.focusStartIndex !== nextProps.focusStartIndex ||
      this.props.focusEndIndex !== nextProps.focusEndIndex
    );
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
        formatter: (params: { dataType: string; name: string }) => {
          switch (params.dataType) {
            case "node":
              return params.name;
            default:
              return "";
          }
        },
        backgroundColor: "#FFFFFF",
        extraCssText: `box-shadow: 0px 0px 4px 2px rgba( 0, 0, 0, 0.2 ); 
           max-width: 30em;
           overflow: hidden;
           text-align: center;
           padding: 1em;
           vertical-align: middle;
          `,
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
            edgeLength: 24,
            repulsion: 256,
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
      <ReactECharts
        ref={this.props.refEChart}
        style={{ height: "100%", width: "100%" }}
        option={this.getOption()}
        opts={{ renderer: "canvas" }}
      />
    );
  }
}

export default Graph;
