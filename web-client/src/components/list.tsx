// React
import * as React from "react";

// Components
import ListHeader from "./list-header";
// import ListSectionHeader from "./list-section-header";
import ListCapture from "./list-capture";
import ButtonRelated from "./button-related";

// Utils
import {
  constructNodeMap,
  constructEdgeMap,
  doesEdgeContainNode,
  getNodesAdjacentToNode,
  getEdgesOtherNodeId
} from "../utils";
import { uniq } from "lodash";

// Types
import { Node, Edge, ListData, id } from "../types";
import { EdgeType } from "../__generated__/types";

interface Props {
  // Header Props
  handleHeaderCaptureTextChange: (text: string) => void;
  handleHeaderCapture: () => void;
  handleExpand: () => void;
  isHeaderCapturing: boolean;
  handleHeaderIsCapturing: () => void;
  handleSurfaceTextChange: (text: string) => void;
  handleSurface: () => void;
  handleSurfaceClear: () => void;
  // List
  isLevel0Capture: boolean;
  isHidden: boolean;
  nodes: Array<Node>;
  edges: Array<Edge>;
  // Captures
  handleIsShowingRelated: (id: string) => (() => void);
  isShowingRelated: (id: string) => boolean;
  handleMore: (id: string) => (() => void);
  isMore: (id: string) => boolean;
  handleComment: (id: string) => (() => void);
  handleFocus: (id: string) => (() => void);
  handleEdit: (id: string) => (() => void);
  isEditing: (id: string) => boolean;
  handleArchive: (id: string) => (() => void);
  handleTextChange: (id: string) => ((text: string) => void);
  handleCapture: (id: string) => (() => void);
}

interface State {
  listData: ListData;
}

class List extends React.Component<Props, State> {
  // map ids to objects
  nodeMap: Map<string, Node> = new Map();
  edgeMap: Map<string, Edge> = new Map();

  constructor(props: Props) {
    super(props);

    this.nodeMap = constructNodeMap(props.nodes);
    this.edgeMap = constructEdgeMap(props.edges);

    this.state = {
      listData: this.constructListData(props.nodes, props.edges)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.nodeMap = constructNodeMap(nextProps.nodes);
    this.edgeMap = constructEdgeMap(nextProps.edges);

    this.setState({
      listData: this.constructListData(nextProps.nodes, nextProps.edges)
    });
  }

  constructListData = (nodes: Array<Node>, edges: Array<Edge>): ListData => {
    let listData: ListData = [];

    const levelZeroNodes = nodes.filter(node => node.level === 0);

    levelZeroNodes.forEach(node => {
      let connectedEdges = edges.filter(edge =>
        doesEdgeContainNode(edge, node)
      );

      // captures related through an entity or model
      let relatedCaptures: Array<id> = [];
      // entity or tags contained in capture
      let contains: Array<string> = [];

      connectedEdges.forEach(edge => {
        switch (edge.type) {
          case EdgeType.REFERENCES || EdgeType.TAGGED_WITH:
            const entityOrTagNodeId = getEdgesOtherNodeId(edge, node);
            const entityOrTagNode = this.nodeMap.get(entityOrTagNodeId);
            if (entityOrTagNode) {
              contains = contains.concat(entityOrTagNode.text);
              let adjacentNodes = getNodesAdjacentToNode(
                entityOrTagNode,
                this.props.edges
              ).filter(adjacentNodeId => {
                const adjacentNode = this.nodeMap.get(adjacentNodeId);
                return adjacentNode && adjacentNode.level !== 0;
              });
              relatedCaptures = uniq(relatedCaptures.concat(adjacentNodes));
            }
            break;
          default:
            break;
        }
      });

      listData = listData.concat({
        id: node.id,
        contains: contains,
        related: relatedCaptures
      });
    });

    return listData;
  };

  renderPadding = () => (
    <div className={`pa4`}>
      <ListHeader
        handleCaptureTextChange={this.props.handleHeaderCaptureTextChange}
        handleCapture={this.props.handleHeaderCapture}
        handleExpand={this.props.handleExpand}
        isCapturing={this.props.isHeaderCapturing}
        handleIsCapturing={this.props.handleHeaderIsCapturing}
        handleSurfaceTextChange={this.props.handleSurfaceTextChange}
        handleSurface={this.props.handleSurface}
        handleClear={this.props.handleSurfaceClear}
      />
    </div>
  );

  render() {
    if (this.props.isHidden) {
      return (
        <div className={`pa4`}>
          <ListHeader
            handleCaptureTextChange={this.props.handleHeaderCaptureTextChange}
            handleCapture={this.props.handleHeaderCapture}
            handleExpand={this.props.handleExpand}
            isCapturing={this.props.isHeaderCapturing}
            handleIsCapturing={this.props.handleHeaderIsCapturing}
            handleSurfaceTextChange={this.props.handleSurfaceTextChange}
            handleSurface={this.props.handleSurface}
            handleClear={this.props.handleSurfaceClear}
          />
        </div>
      );
    }

    return (
      <div className={`relative w-100 vh-100`}>
        {/* This is the list header that is actually seen when the list is not hidden */}
        <div className={`z-max absolute top-0 left-0 pa4 w-100 bg-light-gray`}>
          <ListHeader
            handleCaptureTextChange={this.props.handleHeaderCaptureTextChange}
            handleCapture={this.props.handleHeaderCapture}
            handleExpand={this.props.handleExpand}
            isCapturing={this.props.isHeaderCapturing}
            handleIsCapturing={this.props.handleHeaderIsCapturing}
            handleSurfaceTextChange={this.props.handleSurfaceTextChange}
            handleSurface={this.props.handleSurface}
            handleClear={this.props.handleSurfaceClear}
          />
        </div>

        <div
          className={`flex flex-column overflow-auto w-100 vh-100 bg-light-gray`}
        >
          {/* This is a hack to make scrolling with fixed header work. This serves as padding. The padding needs to be the same height as the fixed bar or else it will  */}
          {this.renderPadding()}
          <div
            className={`z-max absolute top-0 left-0 pa4 w-100 bg-light-gray`}
          >
            <ListHeader
              handleCaptureTextChange={this.props.handleHeaderCaptureTextChange}
              handleCapture={this.props.handleHeaderCapture}
              handleExpand={this.props.handleExpand}
              isCapturing={this.props.isHeaderCapturing}
              handleIsCapturing={this.props.handleHeaderIsCapturing}
              handleSurfaceTextChange={this.props.handleSurfaceTextChange}
              handleSurface={this.props.handleSurface}
              handleClear={this.props.handleSurfaceClear}
            />
          </div>

          {this.state.listData.map(entry => {
            const capture = this.nodeMap.get(entry.id);
            return (
              capture && (
                <div className={`relative`}>
                  <ListCapture
                    key={capture.id}
                    text={capture.text}
                    handleExpand={this.props.handleExpand}
                    handleMore={this.props.handleMore(capture.id)}
                    isMore={this.props.isMore(capture.id)}
                    handleComment={this.props.handleComment(capture.id)}
                    handleFocus={this.props.handleFocus(capture.id)}
                    handleEdit={this.props.handleEdit(capture.id)}
                    isEditing={this.props.isEditing(capture.id)}
                    handleArchive={this.props.handleArchive(capture.id)}
                    handleTextChange={this.props.handleTextChange(capture.id)}
                    handleCapture={this.props.handleCapture(capture.id)}
                  />
                  {entry.related.length > 0 && (
                    <div className={`w-100`}>
                      <div
                        className={`center pa2 w2`}
                        data-tip={`${
                          this.props.isShowingRelated(capture.id)
                            ? "hide"
                            : "show"
                        } related captures`}
                      >
                        <ButtonRelated
                          isUp={this.props.isShowingRelated(capture.id)}
                          onClick={this.props.handleIsShowingRelated(
                            capture.id
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {this.props.isShowingRelated(capture.id) && (
                    <div className={`pb4`}>
                      {entry.related.map(relatedId => {
                        const relatedCapture = this.nodeMap.get(relatedId);
                        return (
                          <div className={`pl4`}>
                            {relatedCapture && (
                              <ListCapture
                                key={relatedCapture.id}
                                text={relatedCapture.text}
                                handleExpand={this.props.handleExpand}
                                handleMore={this.props.handleMore(
                                  relatedCapture.id
                                )}
                                isMore={this.props.isMore(relatedCapture.id)}
                                handleComment={this.props.handleComment(
                                  relatedCapture.id
                                )}
                                handleFocus={this.props.handleFocus(
                                  relatedCapture.id
                                )}
                                handleEdit={this.props.handleEdit(
                                  relatedCapture.id
                                )}
                                isEditing={this.props.isEditing(
                                  relatedCapture.id
                                )}
                                handleArchive={this.props.handleArchive(
                                  relatedCapture.id
                                )}
                                handleTextChange={this.props.handleTextChange(
                                  relatedCapture.id
                                )}
                                handleCapture={this.props.handleCapture(
                                  relatedCapture.id
                                )}
                                highlightTerms={entry.contains}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )
            );
          })}
        </div>
      </div>
    );
  }
}

export default List;
