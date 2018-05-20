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
  handleIsShowingRelated: (id: string) => (() => void) | undefined;
  isShowingRelated: (id: string) => boolean | undefined;
  handleMore: (id: string) => (() => void);
  isMore: (id: string) => boolean;
  handleComment: (id: string) => ((text: string) => void);
  comments?: Array<ListFieldsFragment>;
  handleFocus: (id: string) => (() => void);
  handleEdit: (id: string) => ((text: string) => void);
  isEditing: (id: string) => boolean;
  handleArchive: (id: string) => (() => void);
  handleDismissCaptureRelation: (fromId: string, toId: string) => void;
}

interface State {
  isShowingDismissRelationMap: Map<string, boolean>;
}

class List extends React.Component<Props, State> {
  _scrollContainer: ScrollContainer | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isShowingDismissRelationMap: new Map<string, boolean>()
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.scrollToId) {
      this.scrollTo(nextProps.scrollToId);
    }
  }

  scrollTo = (id: string) => {
    if (this._scrollContainer) {
      this._scrollContainer.scrollTo(id);
    }
  };

  renderHeaderPadding = () => (
    <div>
      {this.props.sessionId ? (
        <ListSessionHeader
          title={this.props.sessionTitle}
          tags={this.props.sessionTags}
          isEditingTags={this.props.sessionIsEditingTags}
          isEditingTitle={this.props.sessionIsEditingTitle}
          handleEditTags={this.props.sessionHandleEditTags}
          handleEditTitle={this.props.sessionHandleEditTitle}
          handleClose={this.props.sessionHandleClose}
        />
      ) : (
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
      )}
    </div>
  );

  renderFooterPadding = () =>
    this.props.sessionId ? (
      <ScrollContainerElement name={SESSION_CAPTURE_INPUT_ID}>
        <div className={`flex-grow pv4 bg-white`}>
          <InputCapture
            handleCapture={this.props.sessionHandleCapture}
            handleTextChange={this.props.handleHeaderCaptureTextChange}
            clearOnEnter={true}
            allowToolbar={false}
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
        {/* This is the list header that is actually seen when the list is not hidden */}
        {/* {this.props.sessionId ? (
          <div className={`z-max absolute top-0 left-0 w-100 bg-white`}>
            <ListSessionHeader
              title={this.props.sessionTitle}
              tags={this.props.sessionTags}
              isEditingTags={this.props.sessionIsEditingTags}
              isEditingTitle={this.props.sessionIsEditingTitle}
              handleEditTags={this.props.sessionHandleEditTags}
              handleEditTitle={this.props.sessionHandleEditTitle}
              handleClose={this.props.sessionHandleClose}
            />
          </div>
        ) : (
          <div
            className={`z-max absolute top-0 left-0 pa4 w-100 bg-light-gray`}
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
            />
          </div>
        )} */}
        <ScrollContainer
          ref={scrollContainer => (this._scrollContainer = scrollContainer)}
        >
          <div
            className={`flex flex-column overflow-auto w-100 vh-100 bg-light-gray`}
          >
            {/* This is a hack to make scrolling with fixed header work. This serves as padding. The padding needs to be the same height as the fixed bar or else it will  */}
            {this.renderHeaderPadding()}

            {this.props.header &&
              !this.props.sessionId && (
                <div className={`pa3 gray`}>{this.props.header}</div>
              )}

            {this.props.listData.map(listItem => (
              <div className={``} key={listItem.id}>
                <div
                  className={`${this.props.scrollToId === listItem.id &&
                    "ba br4 b--accent"}`}
                >
                  <ScrollContainerElement name={listItem.id}>
                    <ListCapture
                      text={listItem.text.text}
                      handleExpand={this.props.handleExpand(listItem.id)}
                      handleMore={this.props.handleMore(listItem.id)}
                      isMore={this.props.isMore(listItem.id)}
                      handleComment={this.props.handleComment(listItem.id)}
                      handleFocus={this.props.handleFocus(listItem.id)}
                      handleEdit={this.props.handleEdit(listItem.id)}
                      isEditing={this.props.isEditing(listItem.id)}
                      handleArchive={this.props.handleArchive(listItem.id)}
                      handleIsShowingRelated={
                        listItem.relatedItems &&
                        listItem.relatedItems.length > 0
                          ? this.props.handleIsShowingRelated(listItem.id)
                          : undefined
                      }
                      isShowingRelated={
                        listItem.relatedItems &&
                        listItem.relatedItems.length > 0
                          ? this.props.isShowingRelated(listItem.id)
                          : undefined
                      }
                      annotations={listItem.text.annotations}
                    />
                  </ScrollContainerElement>
                </div>
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
                              let nextIsShowingDismissRelationMap = this.state
                                .isShowingDismissRelationMap;
                              nextIsShowingDismissRelationMap.set(
                                relatedItem.id,
                                true
                              );
                              this.setState({
                                isShowingDismissRelationMap: nextIsShowingDismissRelationMap
                              });
                            }}
                            onMouseLeave={() => {
                              let nextIsShowingDismissRelationMap = this.state
                                .isShowingDismissRelationMap;
                              nextIsShowingDismissRelationMap.set(
                                relatedItem.id,
                                false
                              );
                              this.setState({
                                isShowingDismissRelationMap: nextIsShowingDismissRelationMap
                              });
                            }}
                          >
                            <div className={`flex-column w2`}>
                              <div className={`dt w-100 h-100`}>
                                {this.state.isShowingDismissRelationMap.get(
                                  relatedItem.id
                                ) && (
                                  <div className={`dtc v-mid`}>
                                    <div
                                      data-tip={
                                        "mark this capture as unrelated"
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
                            <div
                              className={`flex-grow ${this.props.scrollToId ===
                                relatedItem.id && "ba br4 b--accent"}`}
                            >
                              <ScrollContainerElement name={relatedItem.id}>
                                <ListCapture
                                  text={relatedItem.text.text}
                                  handleExpand={this.props.handleHeaderExpand}
                                  handleMore={this.props.handleMore(
                                    relatedItem.id
                                  )}
                                  isMore={this.props.isMore(relatedItem.id)}
                                  handleComment={this.props.handleComment(
                                    relatedItem.id
                                  )}
                                  handleFocus={this.props.handleFocus(
                                    relatedItem.id
                                  )}
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

            {/* This is a hack to make scrolling with fixed footer work. This serves as padding. The padding needs to be the same height as the fixed bar or else it will  */}
            {this.renderFooterPadding()}
          </div>
        </ScrollContainer>

        {/* {this.props.sessionId ? (
          <div
            className={`z-max absolute bottom-0 left-0 pv4 w-100 bt b--light-gray bg-white`}
          >
            <InputCapture
              handleCapture={this.props.sessionHandleCapture}
              handleTextChange={this.props.handleHeaderCaptureTextChange}
              clearOnEnter={true}
              allowToolbar={false}
            />
          </div>
        ) : null} */}
      </div>
    );
  }
}

export default List;
