// React
import * as React from "react";

// Components
import ListHeader from "./list-header";
import ListCapture from "./list-capture";
import InputCapture from "./input-capture";
import ListSessionHeader from "./list-session-header";

// Utils

// Types
import { ListFieldsFragment } from "../__generated__/types";

interface Props {
  // List
  isHidden: boolean;
  handleIsHidden: () => void;
  listData: Array<ListFieldsFragment>;
  // Session
  sessionId?: string;
  sessionTitle?: string;
  sessionTags?: Array<string>;
  sessionHandleEditTitle: () => void;
  sessionHandleEditTags: () => void;
  sessionIsEditingTitle: boolean;
  sessionIsEditingTags: boolean;
  sessionHandleClose: () => void;
  // Header
  handleHeaderCaptureTextChange: (text: string) => void;
  handleHeaderCapture: () => void;
  handleHeaderExpand: () => void;
  isHeaderCapturing: boolean;
  handleHeaderIsCapturing: () => void;
  handleSurfaceTextChange: (text: string) => void;
  handleSurface: () => void;
  handleSurfaceClear: () => void;
  // Captures
  handleExpand: (id: string) => (() => void);
  handleIsShowingRelated: (id: string) => (() => void) | undefined;
  isShowingRelated: (id: string) => boolean | undefined;
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

interface State {}

class List extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

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
          />
          }
        </div>
      )}
    </div>
  );

  renderFooterPadding = () => (
    <div>
      {this.props.sessionId ? (
        <div className={`pv4`}>
          <InputCapture
            handleCapture={this.props.handleHeaderCapture}
            handleTextChange={this.props.handleHeaderCaptureTextChange}
            clearOnEnter={true}
          />
        </div>
      ) : null}
    </div>
  );

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
          />
        </div>
      );
    }

    return (
      <div className={`relative w-100 vh-100`}>
        {/* This is the list header that is actually seen when the list is not hidden */}
        {this.props.sessionId ? (
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
        )}

        <div
          className={`flex flex-column overflow-auto w-100 vh-100 bg-light-gray`}
        >
          {/* This is a hack to make scrolling with fixed header work. This serves as padding. The padding needs to be the same height as the fixed bar or else it will  */}
          {this.renderHeaderPadding()}

          {this.props.listData.map(listItem => (
            <div>
              <ListCapture
                key={listItem.id}
                text={listItem.text.text}
                handleExpand={this.props.handleExpand(listItem.id)}
                handleMore={this.props.handleMore(listItem.id)}
                isMore={this.props.isMore(listItem.id)}
                handleComment={this.props.handleComment(listItem.id)}
                handleFocus={this.props.handleFocus(listItem.id)}
                handleEdit={this.props.handleEdit(listItem.id)}
                isEditing={this.props.isEditing(listItem.id)}
                handleArchive={this.props.handleArchive(listItem.id)}
                handleTextChange={this.props.handleTextChange(listItem.id)}
                handleCapture={this.props.handleCapture(listItem.id)}
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
              />
              {this.props.isShowingRelated(listItem.id) &&
                listItem.relatedItems &&
                listItem.relatedItems.length > 0 && (
                  <div className={`pl4 pb4`}>
                    {listItem.relatedItems.map(relatedItem => {
                      if (!relatedItem) {
                        return null;
                      }
                      return (
                        <ListCapture
                          key={relatedItem.id}
                          text={relatedItem.text.text}
                          handleExpand={this.props.handleHeaderExpand}
                          handleMore={this.props.handleMore(relatedItem.id)}
                          isMore={this.props.isMore(relatedItem.id)}
                          handleComment={this.props.handleComment(
                            relatedItem.id
                          )}
                          handleFocus={this.props.handleFocus(relatedItem.id)}
                          handleEdit={this.props.handleEdit(relatedItem.id)}
                          isEditing={this.props.isEditing(relatedItem.id)}
                          handleArchive={this.props.handleArchive(
                            relatedItem.id
                          )}
                          handleTextChange={this.props.handleTextChange(
                            relatedItem.id
                          )}
                          handleCapture={this.props.handleCapture(
                            relatedItem.id
                          )}
                          annotations={relatedItem.text.annotations}
                        />
                      );
                    })}
                  </div>
                )}
            </div>
          ))}
          {/* This is a hack to make scrolling with fixed footer work. This serves as padding. The padding needs to be the same height as the fixed bar or else it will  */}
          {this.renderFooterPadding()}
        </div>
        {this.props.sessionId ? (
          <div
            className={`z-max absolute bottom-0 left-0 pv4 w-100 bt b--light-gray bg-white`}
          >
            <InputCapture
              handleCapture={this.props.handleHeaderCapture}
              handleTextChange={this.props.handleHeaderCaptureTextChange}
              clearOnEnter={true}
              allowToolbar={false}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default List;
