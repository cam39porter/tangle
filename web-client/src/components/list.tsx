// React
import * as React from "react";

// Components
import ListHeader from "./list-header";
import ListCapture from "./list-capture";
import InputCapture from "./input-capture";
import ListSessionHeader from "./list-session-header";
import ScrollContainer from "./scroll-container";
import ScrollContainerElement from "./scroll-container-element";
import ButtonExit from "./button-exit";
import ReactTooltip from "react-tooltip";

// Utils
export const SESSION_CAPTURE_INPUT_ID = "session-capture-input";

// Types
import { ListFieldsFragment } from "../__generated__/types";

interface Props {
  // List
  isHidden: boolean;
  handleIsHidden: () => void;
  listData: Array<ListFieldsFragment>;
  scrollToId?: string;
  header?: string;
  // Session
  sessionId?: string;
  sessionTitle?: string;
  sessionTags?: Array<string>;
  sessionHandleEditTitle: (title: string) => void;
  sessionHandleEditTags: (tags: string) => void;
  sessionIsEditingTitle: boolean;
  sessionIsEditingTags: boolean;
  sessionHandleClose: () => void;
  sessionHandleCapture: () => void;
  // Header
  handleHeaderCaptureTextChange: (text: string) => void;
  handleHeaderCapture: () => void;
  handleHeaderExpand: () => void;
  isHeaderCapturing: boolean;
  handleHeaderIsCapturing: () => void;
  handleSurfaceTextChange: (text: string) => void;
  handleSurface: () => void;
  handleSurfaceClear: () => void;
  surfaceStartingText?: string;
  headerPaddingText: string;
  footerPaddingText: string;
  // Captures
  handleExpand: (id: string) => (() => void);
  handleIsShowingRelated: (
    id: string,
    callback?: () => void
  ) => (() => void) | undefined;
  isShowingRelated: (id: string) => boolean | undefined;
  handleFocus: (id: string) => (() => void);
  handleEdit: (id: string) => ((text: string) => void);
  isEditing: (id: string) => boolean;
  handleArchive: (id: string) => (() => void);
  handleDismissCaptureRelation: (fromId: string, toId: string) => void;
}

interface State {
  isHoveringOverMap: Map<string, boolean>;
}

class List extends React.Component<Props, State> {
  _scrollContainer: ScrollContainer | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isHoveringOverMap: new Map<string, boolean>()
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.scrollToId) {
      this.scrollTo(nextProps.scrollToId);
    }
  }

  scrollTo = (id: string) => {
    // check if this is a root capture and if so scroll
    let rootIndex = this.props.listData.findIndex(
      listItem => listItem.id === id
    );
    if (rootIndex >= 0) {
      this._scrollContainer && this._scrollContainer.scrollTo(id);
      return;
    }

    // not a rootCapture so showRelated for rootCapture and then scroll
    this.props.listData.forEach(rootListItem => {
      let childListItemIndex =
        rootListItem.relatedItems &&
        rootListItem.relatedItems.findIndex(childItem => {
          if (childItem) {
            return childItem.id === id;
          }
          return false;
        });
      if (childListItemIndex !== null && childListItemIndex >= 0) {
        let parentIsShowingRelated = this.props.isShowingRelated(
          rootListItem.id
        );
        if (!parentIsShowingRelated) {
          let handleParentIsShowingRelated = this.props.handleIsShowingRelated(
            rootListItem.id,
            () => {
              this._scrollContainer && this._scrollContainer.scrollTo(id);
            }
          );
          handleParentIsShowingRelated && handleParentIsShowingRelated();
        } else {
          this._scrollContainer && this._scrollContainer.scrollTo(id);
        }
      }
    });
  };

  renderHeader = () => (
    <div>
      {this.props.sessionId ? (
        <ListSessionHeader
          title={this.props.sessionTitle}
          tags={this.props.sessionTags}
          handleEditTags={this.props.sessionHandleEditTags}
          handleEditTitle={this.props.sessionHandleEditTitle}
          handleClose={this.props.sessionHandleClose}
        />
      ) : (
        <div
          className={`pa4 ${
            this.props.isHeaderCapturing ? "bg-accent" : "bg-base"
          }`}
        >
          <ListHeader
            handleCaptureTextChange={this.props.handleHeaderCaptureTextChange}
            handleCapture={this.props.handleHeaderCapture}
            handleExpand={this.props.handleHeaderExpand}
            isCapturing={this.props.isHeaderCapturing}
            handleIsCapturing={this.props.handleHeaderIsCapturing}
            handleSurfaceTextChange={this.props.handleSurfaceTextChange}
            handleSurface={this.props.handleSurface}
            handleClear={this.props.handleSurfaceClear}
            surfaceStartingText={this.props.surfaceStartingText}
          />
        </div>
      )}
    </div>
  );

  renderFooter = () =>
    this.props.sessionId ? (
      <ScrollContainerElement name={SESSION_CAPTURE_INPUT_ID}>
        <div className={`flex-grow pv4 bg-white`}>
          <InputCapture
            handleCapture={this.props.sessionHandleCapture}
            handleOnChange={this.props.handleHeaderCaptureTextChange}
          />
        </div>
      </ScrollContainerElement>
    ) : null;

  render() {
    if (this.props.isHidden) {
      return (
        <div className={`pa4`}>
          <ListHeader
            handleCaptureTextChange={this.props.handleHeaderCaptureTextChange}
            handleCapture={this.props.handleHeaderCapture}
            handleExpand={this.props.handleHeaderExpand}
            isCapturing={this.props.isHeaderCapturing}
            handleIsCapturing={this.props.handleHeaderIsCapturing}
            handleSurfaceTextChange={this.props.handleSurfaceTextChange}
            handleSurface={this.props.handleSurface}
            handleClear={this.props.handleSurfaceClear}
            surfaceStartingText={this.props.surfaceStartingText}
          />
        </div>
      );
    }

    return (
      <div className={`relative w-100 vh-100`}>
        <ScrollContainer
          ref={scrollContainer => (this._scrollContainer = scrollContainer)}
        >
          <div
            className={`flex flex-column overflow-auto w-100 vh-100 bg-light-gray`}
          >
            {this.renderHeader()}

            {this.props.header &&
              !this.props.sessionId && (
                <div className={`pv4 ph3 gray`}>{this.props.header}</div>
              )}

            {this.props.listData.map(listItem => (
              <div className={``} key={listItem.id}>
                <ScrollContainerElement name={listItem.id}>
                  <ListCapture
                    captureId={listItem.id}
                    text={listItem.text.text}
                    handleExpand={this.props.handleExpand(listItem.id)}
                    handleFocus={this.props.handleFocus(listItem.id)}
                    handleEdit={this.props.handleEdit(listItem.id)}
                    isEditing={this.props.isEditing(listItem.id)}
                    handleArchive={this.props.handleArchive(listItem.id)}
                    handleIsShowingRelated={
                      listItem.relatedItems && listItem.relatedItems.length > 0
                        ? this.props.handleIsShowingRelated(listItem.id)
                        : undefined
                    }
                    isShowingRelated={
                      listItem.relatedItems && listItem.relatedItems.length > 0
                        ? this.props.isShowingRelated(listItem.id)
                        : undefined
                    }
                    annotations={listItem.text.annotations}
                    isGraphFocus={this.props.scrollToId === listItem.id}
                  />
                </ScrollContainerElement>
                {this.props.isShowingRelated(listItem.id) &&
                  listItem.relatedItems &&
                  listItem.relatedItems.length > 0 && (
                    <div className={`pb4`}>
                      {listItem.relatedItems.map(relatedItem => {
                        if (!relatedItem) {
                          return null;
                        }
                        return (
                          <div
                            className={`flex`}
                            key={relatedItem.id}
                            onMouseEnter={() => {
                              let nextIsHoverOverMap = this.state
                                .isHoveringOverMap;
                              nextIsHoverOverMap.set(relatedItem.id, true);
                              this.setState({
                                isHoveringOverMap: nextIsHoverOverMap
                              });
                            }}
                            onMouseLeave={() => {
                              let nextIsShowingDismissRelationMap = this.state
                                .isHoveringOverMap;
                              nextIsShowingDismissRelationMap.set(
                                relatedItem.id,
                                false
                              );
                              this.setState({
                                isHoveringOverMap: nextIsShowingDismissRelationMap
                              });
                            }}
                          >
                            <div className={`flex-column w2`}>
                              <div className={`dt w-100 h-100`}>
                                {this.state.isHoveringOverMap.get(
                                  relatedItem.id
                                ) && (
                                  <div className={`dtc v-mid`}>
                                    <div
                                      data-tip={
                                        "Mark this capture as unrelated"
                                      }
                                    >
                                      <ButtonExit
                                        onClick={() => {
                                          this.props.handleDismissCaptureRelation(
                                            listItem.id,
                                            relatedItem.id
                                          );
                                        }}
                                      />
                                    </div>
                                    <ReactTooltip />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={`flex-grow`}>
                              <ScrollContainerElement name={relatedItem.id}>
                                <ListCapture
                                  captureId={relatedItem.id}
                                  text={relatedItem.text.text}
                                  handleExpand={this.props.handleHeaderExpand}
                                  handleFocus={this.props.handleFocus(
                                    relatedItem.id
                                  )}
                                  handleFocusWithId={this.props.handleFocus}
                                  handleEdit={this.props.handleEdit(
                                    relatedItem.id
                                  )}
                                  isEditing={this.props.isEditing(
                                    relatedItem.id
                                  )}
                                  handleArchive={this.props.handleArchive(
                                    relatedItem.id
                                  )}
                                  annotations={relatedItem.text.annotations}
                                  isGraphFocus={
                                    this.props.scrollToId === relatedItem.id
                                  }
                                />
                              </ScrollContainerElement>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}
            {this.renderFooter()}
          </div>
        </ScrollContainer>
      </div>
    );
  }
}

export default List;
