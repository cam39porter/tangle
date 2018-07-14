// React
import * as React from "react";

// Router
import { withRouter, RouteComponentProps } from "react-router";

// GraphQL

// Components

// Utils
import { AnalyticsUtils } from "../../utils/index";

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
        className={`pa3 bg-editor-gray dark-gray bw1 br3 ba b--light-gray lh-copy`}
        style={{
          maxWidth: "20em",
          width: "20em"
        }}
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
        <div
          className={`f6 pb2 fw3 pointer accent`}
          onClick={() => {
            this.props.history.push(
              `/note/${encodeURIComponent(id)}/format/list/related`
            );
            AnalyticsUtils.trackEvent({
              category: this.props.match.params["id"]
                ? AnalyticsUtils.Categories.Session
                : AnalyticsUtils.Categories.Home,
              action: AnalyticsUtils.Actions.OpenSession,
              label: id
            });
          }}
        >
          {title || "Untitled"}
        </div>
        <div
          className={`overflow-hidden f7`}
          dangerouslySetInnerHTML={{
            __html: startingHtml
          }}
          style={{
            cursor: "default"
          }}
        />
      </div>
    );
  }
}

export default withRouter(CardCapture);
