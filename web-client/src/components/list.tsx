// React
import * as React from "react";

// Components
import ListCapture from "./list-capture";
import ScrollContainer from "./scroll-container";
import ScrollContainerElement from "./scroll-container-element";
// import ButtonExit from "./button-exit";
// import ReactTooltip from "react-tooltip";

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
                  startingText={listItem.text.text}
                  handleExpand={this.props.handleExpand(listItem.id)}
                  handleFocus={this.props.handleFocus(listItem.id)}
                  handleEdit={this.props.handleEdit(listItem.id)}
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
            </div>
          ))}
        </div>
      </ScrollContainer>
    );
  }
}

export default List;
