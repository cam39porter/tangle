// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// GraphQL

// Components

// Utils

// Types
interface Props extends RouteComponentProps<{}> {
  sessionParents: Array<{
    __typename: "Session";
    id: string;
    title: string | null;
    created: number;
  }>;
  captureId: string;
  startingHtml: string;
}

interface State {
  isMouseOver: boolean;
}

class CardCapture extends React.Component<Props, State> {
  focus;

  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      isMouseOver: false
    };
  }

  render() {
    const { captureId, startingHtml, sessionParents } = this.props;
    const { isMouseOver } = this.state;
    const { title, id } =
      sessionParents.length > 0
        ? sessionParents[0]
        : { id: "", title: "No parent" };

    return (
      <div
        className={`pa3 dark-gray bg-animate hover-bg-white br4 ba b--light-gray lh-copy`}
        onMouseOver={() => {
          this.setState({
            isMouseOver: true
          });
        }}
        onMouseOut={() => {
          this.setState({
            isMouseOver: false
          });
        }}
      >
        <div className={`f5 fw4 pointer ${isMouseOver && "accent"}`}>
          {title || "Untitled"}
        </div>
        <div
          className={`overflow-hidden f7`}
          style={{
            width: "35em"
          }}
          dangerouslySetInnerHTML={{
            __html: startingHtml
          }}
        />
      </div>
    );
  }
}

export default withRouter(CardCapture);
