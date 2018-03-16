import * as React from "react";

import { GetCapturesQuery } from "../__generated__/types";
import { GetCaptures as QUERY } from "../queries";
import { graphql, QueryProps } from "react-apollo";

import { RouteComponentProps } from "react-router";
import NavigationBar from "../components/navigation-bar";
import ListItem from "../components/list-item";

import ReactECharts from "echarts-for-react";

import config from "../cfg";

interface Params {
  query: string;
}

interface Data extends QueryProps<GetCapturesQuery>, GetCapturesQuery {}

export interface Props extends RouteComponentProps<Params> {
  data: Data;
}

export interface SurfaceResultsState {
  value: string;
}

class SurfaceResults extends React.Component<Props, SurfaceResultsState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.props.match.params.query
    };

    this.handleSurface = this.handleSurface.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.renderResults = this.renderResults.bind(this);
    this.renderNetwork = this.renderNetwork.bind(this);
  }

  handleChange(e: React.FormEvent<HTMLInputElement>): void {
    this.setState({
      value: e.currentTarget.value
    });
  }

  handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      this.handleSurface();
    }
  }

  handleSurface() {
    this.props.history.push(`/surface/${this.state.value}`);
  }

  renderResults() {
    return this.props.data.getCaptures.map(capture => {
      return (
        <ListItem
          body={capture.body}
          onClick={() => {
            //
            return;
          }}
          accentColor={config.surfaceAccentColor}
          key={capture.id}
        />
      );
    });
  }

  renderNetwork() {
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
              data: this.props.data.getCaptures.map(capture => {
                let node: { id: string; name: string; category: string } = {
                  id: capture.id,
                  name: capture.body,
                  category: "capture"
                };
                return node;
              }),
              categories: [
                {
                  name: "capture",
                  itemStyle: {
                    normal: {
                      color: "#4592FF"
                    }
                  }
                }
              ],
              force: {
                initLayout: "circular",
                edgeLength: 5,
                repulsion: 100,
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

  render() {
    return (
      <div className={`w-100 vh-100 flex-column`}>
        {/* Navigation Bar */}
        <div className={`db`}>
          <NavigationBar />
        </div>

        <div className={`flex flex-grow`}>
          {/* Sidebar */}
          <div className={`flex-column flex-grow  measure shadow-1`}>
            {/* Header */}
            <div
              className={`flex-column drawer h4 measure bg-${
                config.surfaceBaseColor
              }`}
            >
              {/* Search Bar */}
              <div
                className={`center w-90 ma3 pa3 h2 bg-white dt br1 b--light-gray shadow-1`}
              >
                <div className={`w-100 dtc v-mid tc`}>
                  <input
                    className={`f6 w-80`}
                    value={this.state.value}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div
              className={`flex-column flex-grow measure bg-light-gray overflow-auto`}
            >
              {this.props.data.loading === false &&
              this.props.data.error === undefined
                ? this.renderResults()
                : null}
            </div>
          </div>

          {/* Graph Visualization */}
          <div className={`flex-column flex-grow`}>
            {this.props.data.loading === false &&
            this.props.data.error === undefined
              ? this.renderNetwork()
              : null}
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(QUERY)(SurfaceResults);
