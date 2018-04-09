// import * as React from "react";

// import { SearchQuery as Response } from "../__generated__/types";
// import { Search as QUERY } from "../queries";
// import { graphql, ChildProps } from "react-apollo";

// import { RouteComponentProps } from "react-router";
// import ResultListItem from "../components/result-list-item";
// import Graph from "../components/graph";
// import CaptureDialogue from "../components/capture-dialogue";

// import { ChevronRight, ChevronLeft } from "react-feather";

// import tinycolor from "tinycolor2";
// import tinygradient from "tinygradient";

// import config from "../cfg";

// const COUNT = 40; // number of results to return
// const PAGE_COUNT = 10; // number of results per page
// const SURFACE_COUNT = 50; // number of results to show on home surface page

// const BLUR_COLOR = "#CCCCCC";
// const FOCUS_COLOR_1 = tinycolor("#19A974");
// const FOCUS_COLOR_2 = tinycolor("#E8FDF5");

// interface InputProps {}

// interface RouteProps extends RouteComponentProps<InputProps> {}

// interface Props extends RouteProps, ChildProps<InputProps, Response> {}

// interface State {
//   focusStartIndex: number;
//   isSearch: boolean;
//   isCapturing: boolean;
// }

// class Capture extends React.Component<Props, State> {
//   // eChart instance ref for dispatching events
//   eChart;

//   constructor(props: Props) {
//     super(props);

//     this.handleIsCapturing = this.handleIsCapturing.bind(this);
//     this.handleDailyCaptureCountClick = this.handleDailyCaptureCountClick.bind(
//       this
//     );
//     this.handlePageDown = this.handlePageDown.bind(this);
//     this.handlePageUp = this.handlePageUp.bind(this);

//     this.state = {
//       focusStartIndex: 0,
//       isSearch: false,
//       isCapturing: true
//     };
//   }

//   handleIsCapturing() {
//     this.setState({
//       isCapturing: !this.state.isCapturing
//     });
//   }

//   handleDailyCaptureCountClick() {
//     this.setState({
//       isSearch: !this.state.isSearch
//     });
//   }

//   handlePageDown() {
//     const startResultIndex = this.state.focusStartIndex;

//     if (startResultIndex === 0) {
//       return;
//     }

//     this.setState({
//       focusStartIndex: startResultIndex - PAGE_COUNT
//     });
//   }

//   handlePageUp() {
//     if (!this.isActivePageUp()) {
//       return;
//     }

//     this.setState({
//       focusStartIndex: this.state.focusStartIndex + PAGE_COUNT
//     });
//   }

//   isActivePageUp() {
//     return (
//       COUNT > this.getFocusEndIndex() &&
//       this.getTotalResults() > this.getFocusEndIndex()
//     );
//   }

//   isLoadedWithoutError() {
//     return (
//       this.props.data &&
//       this.props.data.loading === false &&
//       this.props.data.error === undefined
//     );
//   }

//   isFocusResult(index: number) {
//     return (
//       index >= this.state.focusStartIndex &&
//       index < this.state.focusStartIndex + PAGE_COUNT
//     );
//   }

//   getFocusEndIndex() {
//     const totalResults = this.getTotalResults();

//     return totalResults < this.state.focusStartIndex + PAGE_COUNT
//       ? totalResults
//       : this.state.focusStartIndex + PAGE_COUNT;
//   }

//   getTotalResults() {
//     if (!(this.props.data && this.props.data.searchv2)) {
//       return 0;
//     }
//     return this.props.data.searchv2.graph.captures.length;
//   }

//   getSurfaceNodeData() {
//     if (
//       !(
//         this.props.data &&
//         this.props.data.searchv2 &&
//         this.props.data.getCaptures
//       )
//     ) {
//       return [];
//     }

//     const results = this.props.data.getCaptures.results;
//     return results.map((capture, index) => {
//       return {
//         id: capture.id,
//         name: capture.body,
//         category: `${index}surfaceResult`,
//         label: {
//           show: false,
//           emphasis: {
//             show: false
//           }
//         }
//       };
//     });
//   }

//   getSurfaceCategoryData() {
//     const gradient = this.getGradient(SURFACE_COUNT);

//     return gradient.map((color, index) => {
//       return {
//         name: `${index}surfaceResult`,
//         itemStyle: {
//           normal: {
//             color: color.toHexString()
//           }
//         }
//       };
//     });
//   }

//   getResultsCategoryData() {
//     const totalFocusResults =
//       this.getFocusEndIndex() - this.state.focusStartIndex;
//     const gradientNumber = 2 > totalFocusResults ? 2 : totalFocusResults;
//     const gradient = this.getGradient(gradientNumber);

//     return gradient
//       .map((color, index) => {
//         return {
//           name: `${index}focusResult`,
//           itemStyle: {
//             normal: {
//               color: color.toHexString()
//             }
//           }
//         };
//       })
//       .concat({
//         name: "blurResult",
//         itemStyle: {
//           normal: {
//             color: BLUR_COLOR
//           }
//         }
//       });
//   }

//   getGradient(gradientNumber: number) {
//     return tinygradient(FOCUS_COLOR_1, FOCUS_COLOR_2).rgb(gradientNumber);
//   }

//   renderResultsPagination() {
//     return (
//       <div className={`w-100`}>
//         {/* Results Pagination Text */}
//         {this.getTotalResults() > 0 ? (
//           <div className={`fr pa3 dt`}>
//             <div className={`tr f6 gray dtc v-mid`}>
//               {this.renderResultPagingText()}
//             </div>
//             {this.renderPageDown()}
//             {this.renderPageUp()}
//           </div>
//         ) : (
//           <div className={`fr pa3 dt`}>
//             <div className={`tr f6 gray dtc v-mid`}>No results</div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   renderResultPagingText() {
//     return `Showing results ${this.state.focusStartIndex +
//       1} - ${this.getFocusEndIndex()}`;
//   }

//   renderPageDown() {
//     let isActive = this.state.focusStartIndex > 0;

//     return (
//       <div
//         className={`f6 dtc v-mid ${isActive ? "gray pointer" : "light-gray"}`}
//         onClick={this.handlePageDown}
//       >
//         <ChevronLeft />
//       </div>
//     );
//   }

//   renderPageUp() {
//     return (
//       <div
//         className={`f6 dtc v-mid ${
//           this.isActivePageUp() ? "gray pointer" : "light-gray"
//         }`}
//         onClick={this.handlePageUp}
//       >
//         <ChevronRight />
//       </div>
//     );
//   }

//   renderResults() {
//     if (!(this.props.data && this.props.data.searchv2)) {
//       return;
//     }

//     const totalFocusResults =
//       this.getFocusEndIndex() - this.state.focusStartIndex;
//     const gradientNumber = totalFocusResults < 2 ? 2 : totalFocusResults;
//     let gradient = this.getGradient(gradientNumber);

//     return this.props.data.searchv2.graph.captures
//       .filter((_, index) => {
//         return this.isFocusResult(index);
//       })
//       .map((capture, index) => {
//         return (
//           <div
//             key={capture.id}
//             onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
//               if (this.eChart) {
//                 const eChartInstance = this.eChart.getEchartsInstance();

//                 eChartInstance.dispatchAction({
//                   type: "focusNodeAdjacency",
//                   dataIndex: index
//                 });
//               }
//             }}
//             onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
//               if (this.eChart) {
//                 const eChartInstance = this.eChart.getEchartsInstance();

//                 eChartInstance.dispatchAction({
//                   type: "unfocusNodeAdjacency"
//                 });
//               }
//             }}
//           >
//             <ResultListItem
//               body={capture.body}
//               tags={capture.tags}
//               onClick={() => {
//                 return;
//               }}
//               nodeColor={gradient[index].toHexString()}
//               accentColor={config.captureAccentColor}
//             />
//           </div>
//         );
//       });
//   }

//   renderDailyCaptureCount() {
//     return (
//       <div
//         className={`drawer h4 measure absolute z-max ${
//           this.state.isSearch ? `bg-light-gray` : ""
//         }`}
//         style={{ minWidth: "30em" }}
//       >
//         <div className={`center w-90 dt ma4`}>
//           <div
//             className={`w-100 pointer h2 dtc v-mid tc br1 shadow-1 ${
//               this.state.isSearch
//                 ? `${config.captureAccentColor} bg-white`
//                 : `white bg-${config.captureAccentColor}`
//             }`}
//             onClick={this.handleDailyCaptureCountClick}
//           >
//             <p className={`f6 w-100`}>
//               {`You have made ${"10"} captures today.`}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   renderSideBar() {
//     return (
//       <div className={`flex-column flex-grow z-max measure shadow-3`}>
//         {/* Daily capture count */}
//         {this.renderDailyCaptureCount()}

//         {/* Results */}
//         <div
//           className={`flex-column flex-grow measure bg-light-gray overflow-auto`}
//         >
//           {/* Padding to ensure results start below the search bar */}
//           <div className={`h4 measure`} />
//           {/* Results List */}
//           {this.isLoadedWithoutError() ? this.renderResults() : null}
//         </div>

//         {/* Pagination Footer */}
//         <div
//           className={`flex-column drawer h3 measure bg-white bt b--light-gray`}
//         >
//           {this.isLoadedWithoutError() ? this.renderResultsPagination() : null}
//         </div>
//       </div>
//     );
//   }

//   renderGraph() {
//     if (!this.isLoadedWithoutError()) {
//       return null;
//     }

//     const nodeData = this.state.isSearch ? [] : this.getSurfaceNodeData();

//     const categoryData = this.state.isSearch
//       ? this.getResultsCategoryData()
//       : this.getSurfaceCategoryData();

//     const focusStartIndex = this.state.isSearch
//       ? this.state.focusStartIndex
//       : undefined;

//     const focusEndIndex = this.state.isSearch
//       ? this.getFocusEndIndex()
//       : undefined;

//     return (
//       <div className={`flex-column flex-grow`}>
//         <Graph
//           refEChart={e => {
//             this.eChart = e;
//           }}
//           layout={"force"}
//           focusStartIndex={focusStartIndex}
//           focusEndIndex={focusEndIndex}
//           edgeData={[]}
//           nodeData={nodeData}
//           categoryData={categoryData}
//         />
//       </div>
//     );
//   }

//   renderFloatingButtons() {
//     return (
//       <div className={`bottom-2 right-2 absolute z-999`}>
//         {this.state.isCapturing ? (
//           <CaptureDialogue handleMinimize={this.handleIsCapturing} />
//         ) : (
//           <div
//             className={`dt h3 w3 white br1 bg-${
//               config.captureAccentColor
//             } shadow-1 pointer`}
//             onClick={this.handleIsCapturing}
//           >
//             <div className={`dtc tc v-mid f3`}>+</div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   render() {
//     return (
//       <div className={`w-100 vh-100 flex-column`}>
//         <div className={`flex flex-grow relative`}>
//           {/* Floating Buttons */}
//           {this.renderFloatingButtons()}
//           {/* Search */}
//           {this.state.isSearch
//             ? this.renderSideBar()
//             : this.renderDailyCaptureCount()}
//           {/* Graph */}
//           {this.renderGraph()}
//         </div>
//       </div>
//     );
//   }
// }

// const CaptureWithData = graphql<Response, Props>(QUERY, {
//   options: (ownProps: Props) => ({
//     variables: {
//       query: "tangle app",
//       count: COUNT,
//       surfaceCount: SURFACE_COUNT
//     },
//     fetchPolicy: "network-only"
//   })
// })(Capture);

// export default CaptureWithData;
