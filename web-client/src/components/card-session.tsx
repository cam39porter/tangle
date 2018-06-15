// React
import * as React from "react";

// Router

// Components
import ButtonArchive from "./button-archive";

// Utils

interface Props {
  title: string;
  created: string;
  handleOpen: () => void;
  handleArchive: () => void;
}

interface State {
  isShowingButtons: boolean;
}

class CardSession extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      isShowingButtons: false
    };
  }

  render() {
    return (
      <div
        onMouseEnter={() => {
          this.setState({
            isShowingButtons: true
          });
        }}
        onMouseLeave={() => {
          this.setState({
            isShowingButtons: false
          });
        }}
      >
        <div
          id={`list-session`}
          className={`relative flex flex-wrap pa3 w-100 ${
            this.state.isShowingButtons
              ? "ba br4 b--accent shadow-1 z-max"
              : "bb b--light-gray"
          } bg-white pointer`}
          onClick={this.props.handleOpen}
        >
          <div className={`flex-grow dt`}>
            <div className={`dtc v-mid f4 dark-gray`}>{this.props.title}</div>
            <div className={`dtc v-mid tr f6 accent`}>{this.props.created}</div>
          </div>
          {this.state.isShowingButtons && (
            <div
              className={`absolute flex top--1 right-0 h2 ph2 br4 shadow-1 z-max bg-white gray`}
            >
              <div className={`w2`}>
                <ButtonArchive onClick={this.props.handleArchive} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CardSession;
