// React
import * as React from "react";

// Components
import InputComment from "./input-comment";
import ReactTooltip from "react-tooltip";

// Types
import { ListFieldsFragment } from "../__generated__/types";

interface Props {
  handleComment: (text: string) => void;
  handleFocus?: () => void;
  comments?: Array<ListFieldsFragment>;
}

interface State {}

class ListComment extends React.Component<Props, State> {
  text: string = "";

  render() {
    return (
      <div>
        <InputComment
          handleTextChange={text => {
            this.text = text;
          }}
          handleComment={() => {
            this.props.handleComment(this.text);
          }}
        />
        {this.props.comments &&
          this.props.comments.map(comment => {
            <div className={`flex pa2 w-100`}>
              <div className={`pa3 mr5 f5 br4 ba b--light-gray`}>
                {comment.text}
              </div>
            </div>;
          })}
        <ReactTooltip />
      </div>
    );
  }
}

export default ListComment;
