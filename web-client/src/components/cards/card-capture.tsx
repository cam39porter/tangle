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
  authorName: string | null;
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
    const { captureId, authorName, startingHtml, sessionParents } = this.props;
    const { isMouseOver } = this.state;
    const hasParents = sessionParents.length > 0;
    const { title, id } = hasParents
      ? sessionParents[0]
      : { id: "", title: "" };

    return (
      <div
        className={`pa3 bg-editor-gray dark-gray bw1 br3 ba b--light-gray lh-copy center`}
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
        {hasParents && (
          <div
            className={`f6 fw3 ${
              authorName ? "gray" : "pointer accent dim pb2"
            }`}
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
        )}
        {authorName && (
          <div className={`gray overflow-hidden f6 pb2`}>{authorName}</div>
        )}
        <div
          className={`f7`}
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
