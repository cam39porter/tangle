// React
import * as React from "react";

// Components
import ListCapture from "./list-capture";
import ScrollContainer from "./scroll-container";
import ScrollContainerElement from "./scroll-container-element";
import ButtonExit from "./button-exit";
import ReactTooltip from "react-tooltip";

// Types
import { ListFieldsFragment } from "../__generated__/types";

interface Props {
  listData: Array<ListFieldsFragment>;
  scrollToId?: string;
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

  render() {
    return (
      <ScrollContainer
        ref={scrollContainer => (this._scrollContainer = scrollContainer)}
      >
        <div className={``}>
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
                                    data-tip={"Mark this capture as unrelated"}
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
                                handleExpand={this.props.handleExpand(
                                  relatedItem.id
                                )}
                                handleFocus={this.props.handleFocus(
                                  relatedItem.id
                                )}
                                handleFocusWithId={this.props.handleFocus}
                                handleEdit={this.props.handleEdit(
                                  relatedItem.id
                                )}
                                isEditing={this.props.isEditing(relatedItem.id)}
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
        </div>
      </ScrollContainer>
    );
  }
}

export default List;
