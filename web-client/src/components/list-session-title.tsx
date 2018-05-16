// React
import * as React from "react";

// Components
import InputText from "./input-text";

interface Props {
  isEditing: boolean;
  handleEdit: () => void;
  title?: string;
  handleChange: (title: string) => void;
}

const ListSessionTitle = (props: Props) => {
  const placeholder = "Enter a title";

  return (
    <div>
      {props.isEditing ? (
        <InputText
          placeholder={placeholder}
          startingText={props.title}
          clearOnEnter={false}
          allowToolbar={false}
          handleChange={props.handleChange}
        />
      ) : (
        <div className={`f4`} onDoubleClick={props.handleEdit}>
          {props.title ? (
            <div className={`fw8 dark-gray`}>{props.title}</div>
          ) : (
            <div className={`fw2 i gray`}>{placeholder}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListSessionTitle;
