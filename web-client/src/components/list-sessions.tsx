// React
import * as React from "react";

// Components
import CardSession from "./card-session";
import ScrollContainer from "./scroll-container";
import ScrollContainerElement from "./scroll-container-element";
// import ButtonExit from "./button-exit";
// import ReactTooltip from "react-tooltip";

// Types

interface Props {
  listData: Array<{ title: string; created: string; id: string }>;
  scrollToId?: string;
  handleOpen: (id: string) => (() => void);
  handleArchive: (id: string) => (() => void);
}

interface State {
  isHoveringOverMap: Map<string, boolean>;
}

class ListSessions extends React.Component<Props, State> {
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
    this._scrollContainer && this._scrollContainer.scrollTo(id);
  };

  render() {
    return (
      <ScrollContainer
        ref={scrollContainer => (this._scrollContainer = scrollContainer)}
      >
        <div className={``}>
          {this.props.listData.map(sessionItem => (
            <div className={``} key={sessionItem.id}>
              <ScrollContainerElement name={sessionItem.id}>
                <CardSession
                  title={sessionItem.title}
                  created={sessionItem.created}
                  handleArchive={this.props.handleArchive(sessionItem.id)}
                  handleOpen={this.props.handleArchive(sessionItem.id)}
                />
              </ScrollContainerElement>
            </div>
          ))}
        </div>
      </ScrollContainer>
    );
  }
}

export default ListSessions;
