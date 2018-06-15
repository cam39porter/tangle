// React
import * as React from "react";

// Components
import ListSessionTitle from "./list-session-title";
import ButtonExit from "./button-exit";
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
      <div className={`flex pv3 h3 w-100 bg-white bb bt bw2 b--light-gray`}>
        <div className={`flex-column justify-around flex-grow`}>
          <div className={`ph3`}>
            <ListSessionTitle
              startingTitle={this.props.startingTitle}
              handleEdit={this.props.handleEditTitle}
            />
          </div>
        </div>
        <div className={`flex-column justify-around`}>
          <div>
            <ButtonExit onClick={this.props.handleClose} />
          </div>
        </div>
      </div>
    );
  }
}

export default ListSessionHeader;
