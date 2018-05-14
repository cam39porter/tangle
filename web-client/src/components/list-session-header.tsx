// React
import * as React from "react";

// Components
import ListSessionTitle from "./list-session-title";
import ListSessionTags from "./list-session-tags";
import ButtonEdit from "./button-edit";
import ButtonCheck from "./button-check";
import ButtonContract from "./button-contract";
import ReactTooltip from "react-tooltip";

// Utils

interface Props {
  title?: string;
  handleEditTitle: () => void;
  isEditingTitle: boolean;
  tags?: Array<string>;
  handleEditTags: () => void;
  isEditingTags: boolean;
  handleClose: () => void;
}

const ListSessionHeader = (props: Props) => {
  return (
    <div className={`flex pa2 w-100 bb b--light-gray`}>
      <div className={`ma2 pv1 w2`}>
        {props.isEditingTags || props.isEditingTitle ? (
          <div data-tip={`save your changes`}>
            <ButtonCheck
              onClick={() => {
                props.handleEditTags();
                props.handleEditTitle();
              }}
            />
          </div>
        ) : (
          <div data-tip={`edit the brainstorm title or tags`}>
            <ButtonEdit
              onClick={() => {
                props.handleEditTags();
                props.handleEditTitle();
              }}
            />
          </div>
        )}
      </div>
      <div className={`flex-grow pa2`}>
        <div className={`pv2`}>
          <ListSessionTitle
            title={props.title}
            handleEdit={props.handleEditTitle}
            isEditing={props.isEditingTitle}
          />
        </div>
        <div className={`pv2`}>
          <ListSessionTags
            tags={props.tags}
            handleEdit={props.handleEditTags}
            isEditing={props.isEditingTags}
          />
        </div>
      </div>
      <div className={`ma2 pv1 w2`}>
        <div data-tip={`close the brainstorm`}>
          <ButtonContract onClick={props.handleClose} />
        </div>
      </div>
      <ReactTooltip />
    </div>
  );
};

export default ListSessionHeader;
