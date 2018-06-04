// React
import * as React from "react";

// Components
import ListSessionTitle from "./list-session-title";
import ListSessionTags from "./list-session-tags";
import ButtonEdit from "./button-edit";
import ButtonCheck from "./button-check";
import ButtonExit from "./button-exit";
import ReactTooltip from "react-tooltip";

// Utils

// Types
interface Props {
  title?: string;
  handleEditTitle: (title: string) => void;
  isEditingTitle: boolean;
  tags?: Array<string>;
  handleEditTags: (tags: string) => void;
  isEditingTags: boolean;
  handleClose: () => void;
}

interface State {}

class ListSessionHeader extends React.Component<Props, State> {
  title = "";
  tags = "";

  render() {
    return (
      <div className={`flex pa2 pv3 w-100 bb b--light-gray bg-white`}>
        <div className={`ma2 pv1 w2`}>
          {this.props.isEditingTags || this.props.isEditingTitle ? (
            <div data-tip={`save your changes`}>
              <ButtonCheck
                onClick={() => {
                  this.props.handleEditTags(this.tags);
                  this.props.handleEditTitle(this.title);
                }}
              />
            </div>
          ) : (
            <div data-tip={`edit the brainstorm title or tags`}>
              <ButtonEdit
                onClick={() => {
                  this.props.handleEditTags(this.tags);
                  this.props.handleEditTitle(this.title);
                }}
              />
            </div>
          )}
        </div>
        <div className={`flex-grow pa2`}>
          <div className={`pv2`}>
            <ListSessionTitle
              title={this.props.title}
              handleEdit={() => {
                this.props.handleEditTitle(this.title);
              }}
              isEditing={this.props.isEditingTitle}
              handleChange={title => {
                this.title = title;
              }}
            />
          </div>
          <div className={`pv2`}>
            <ListSessionTags
              tags={this.props.tags}
              handleEdit={() => {
                this.props.handleEditTags(this.tags);
              }}
              isEditing={this.props.isEditingTags}
              handleChange={tags => {
                this.tags = tags;
              }}
            />
          </div>
        </div>
        <div className={`ma2 pv1 w2`}>
          <div data-tip={`exit the brainstorm`}>
            <ButtonExit onClick={this.props.handleClose} />
          </div>
        </div>
        <ReactTooltip />
      </div>
    );
  }
}

export default ListSessionHeader;
