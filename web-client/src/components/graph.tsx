import * as React from "react";

import ReactECharts from "echarts-for-react";

export interface Node {
  id: string;
  name: string;
  category: string;
}

interface Props {
  refEChart?: (eChart: ReactECharts) => void;
  focusStartIndex?: number;
  focusEndIndex?: number;
  nodeData: Array<Node>;
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
      label: {
        show: false
      },
      tooltip: {
        show: true,
        trigger: "item",
        showContent: true,
        confine: true,
        position: "top",
        formatter: "{b}",
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
            initLayout: "circular",
            edgeLength: 8,
            repulsion: 300,
            gravity: 0.2,
            layoutAnimation: true
          },
          roam: true,
          nodeScaleRation: 0.5,
          draggable: false,
          symbol: "circle",
          symbolSize: (value, params: { data: Node }) => {
            return params.data.category === "blurResult" ? 24 : 32;
          },
          symbolRotate: false,
          symbolKeepAspect: false,
          focusNodeAdjacency: true,
          symbolOffset: [0, 0],
          edgeSymbol: ["none", "none"],
          edgeSymbolSize: 10,
          cursor: "pointer",
          itemStyle: {},
          lineStyle: {},
          label: {
            show: false,
            emphasis: {
              show: false
            }
          },
          edgeLabel: {
            show: false,
            emphasis: {
              show: false
            }
          },
          categories: this.props.categoryData,
          nodes: this.props.nodeData,
          edges: [],
          animation: false,
          animationDuration: 4000,
          animationEasingUpdate: "quinticInOut"
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
        opts={{ renderer: "svg" }} // use svg to render the chart.
      />
    );
  }
}

export default Graph;
