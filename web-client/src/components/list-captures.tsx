// React
import * as React from "react";

// GraphQL
import {
  getSessionQuery as getSessionResponse,
  getSessionQueryVariables
} from "../__generated__/types";

import { getSession } from "../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import CardCapture from "./card-capture";
import ScrollContainer from "./scroll-container";
import ScrollContainerElement from "./scroll-container-element";

// Types

interface Props {
  getSession: QueryProps<getSessionQueryVariables> &
    Partial<getSessionResponse>;
  sessionId: string;
  scrollToId?: string;
}

interface State {
  isHoveringOverMap: Map<string, boolean>;
}

class ListCaptures extends React.Component<Props, State> {
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
    const sessionCaptures = this.props.getSession.getSession;
    if (
      !(
        sessionCaptures &&
        sessionCaptures.itemCollection &&
        sessionCaptures.itemCollection.items
      )
    ) {
      return <div />;
    }

    return (
      <ScrollContainer
        ref={scrollContainer => (this._scrollContainer = scrollContainer)}
      >
        <div className={``}>
          {sessionCaptures.itemCollection.items.map(capture => (
            <div className={``} key={capture.id}>
              <ScrollContainerElement name={capture.id}>
                <CardCapture
                  captureId={capture.id}
                  startingText={capture.body}
                />
              </ScrollContainerElement>
            </div>
          ))}
        </div>
      </ScrollContainer>
    );
  }
}

const withGetSession = graphql<getSessionResponse, Props>(getSession, {
  name: "getSession",
  alias: "withGetSession",
  options: (props: Props) => ({
    variables: {
      id: props.sessionId,
      count: 20
    },
    fetchPolicy: "network-only"
  })
});

const ListCapturesWithData = compose(withGetSession)(ListCaptures);

export default ListCapturesWithData;
