// React
import * as React from "react";

// Components
import InputText from "./input-text";

interface Props {
  isEditing: boolean;
  handleEdit: () => void;
  tags?: Array<string>;
  handleChange: (tags: string) => void;
}

const ListSessionTags = (props: Props) => {
  const placeholder = "Enter some tags like #todo #idea";

  let startingText: string | undefined;

  props.tags &&
    props.tags.forEach(tag => {
      startingText = startingText ? startingText + `#${tag} ` : `#${tag} `;
    });

  return (
    <div>
      {props.isEditing ? (
        <InputText
          placeholder={placeholder}
          startingText={startingText}
          clearOnEnter={false}
          allowToolbar={false}
          handleChange={props.handleChange}
          handleEnterKey={props.handleEdit}
        />
      ) : (
        <div className={`f5`} onDoubleClick={props.handleEdit}>
          {props.tags ? (
            <div className={`fw6 dark-gray`}>{startingText}</div>
          ) : (
            <div className={`fw2 i gray`}>{placeholder}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListSessionTags;
