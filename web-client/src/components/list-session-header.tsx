// React
import * as React from "react";

// Components
import ListSessionTitle from "./list-session-title";
import ButtonExit from "./button-exit";
import ReactTooltip from "react-tooltip";

// Utils

// Types
interface Props {
  startingTitle?: string;
  handleEditTitle: (title: string) => void;
  handleClose: () => void;
}

interface State {}

class ListSessionHeader extends React.Component<Props, State> {
  render() {
    return (
      <div className={`flex pa2 w-100 bg-white`}>
        <div className={`flex-grow pa2`}>
          <div className={`pv2`}>
            <ListSessionTitle
              startingTitle={this.props.startingTitle}
              handleEdit={this.props.handleEditTitle}
            />
          </div>
        </div>
        <div className={`ma2 pv1 w2`}>
          <div data-tip={`Exit the brainstorm`}>
            <ButtonExit onClick={this.props.handleClose} />
          </div>
        </div>
        <ReactTooltip />
      </div>
    );
  }
}

export default ListSessionHeader;
