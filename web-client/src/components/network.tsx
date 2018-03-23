import * as React from "react";

import ReactECharts from "echarts-for-react";

import { isEqual } from "lodash";

interface Node {
  id: string;
  name: string;
  category: string;
}

export interface Props {
  nodeData: Array<Node>;
  categoryData: Array<Object>;
}

class Network extends React.Component<Props, object> {
  shouldComponentUpdate(nextProps: Props) {
    return isEqual(this.props, nextProps);
  }

  render() {
    return (
      <ReactECharts
        style={{ height: "100%", width: "100%" }}
        option={{
          title: {
            text: ""
          },
          legend: {
            x: "center",
            show: false
          },
          toolbox: {
            show: false
          },
          tooltip: {
            show: true,
            showContent: true,
            backgroundColor: "#EEEEEE",
            extraCssText: "box-shadow: 0px 0px 4px 2px rgba( 0, 0, 0, 0.2 );",
            textStyle: {
              color: "#000"
            }
          },
          series: [
            {
              type: "graph",
              layout: "force",
              animation: true,
              animationDuration: 4000,
              animationEasingUpdate: "quinticInOut",
              symbolSize: 32,
              focusNodeAdjacency: true,
              label: {
                normal: {
                  show: false,
                  position: "right",
                  formatter: "{b}"
                },
                emphasis: {
                  show: false
                }
              },
              draggable: false,
              roam: false,
              data: this.props.nodeData,
              categories: this.props.categoryData,
              force: {
                initLayout: "circular",
                edgeLength: 5,
                repulsion: 300,
                gravity: 0.2
              },
              edges: [], // [{ source: 1, target: 2 }],
              lineStyle: {
                normal: {
                  opacity: 0.9,
                  width: 1,
                  curveness: 0
                }
              }
            }
          ]
        }}
      />
    );
  }
}

export default Network;
