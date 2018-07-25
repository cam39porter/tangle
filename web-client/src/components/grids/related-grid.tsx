// React
import * as React from "react";

// Router
import { RouteComponentProps } from "react-router";

// GraphQL
import {
  getRelatedCapturesBySessionQuery as getRelatedCapturesBySessionResponse,
  getRelatedCapturesBySessionQueryVariables,
  CaptureFieldsFragment
} from "../../__generated__/types";

import { getRelatedCapturesBySession } from "../../queries";
import { graphql, compose, QueryProps } from "react-apollo";

// Components
import Grid from "../../components/grids/grid";
import Help from "../help/help";

// Utils
import config from "../../cfg";
import { AnalyticsUtils } from "../../utils/index";

// Types

interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  data: QueryProps<getRelatedCapturesBySessionQueryVariables> &
    Partial<getRelatedCapturesBySessionResponse>;
  headerHeight: number;
}

interface State {}

// Class
class RelatedGrid extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const captureCollection = this.props.data.getRelatedCapturesBySession;
    let captures: Array<CaptureFieldsFragment> = [];

    if (captureCollection) {
      captures = captureCollection.items;
    }

    const error = this.props.data.error;
    if (error) {
      return (
        <Help>
          <div>We ran into an issue loading your data.</div>
        </Help>
      );
    }

    if (this.props.data.loading) {
      return (
        <Help>
          <div />
        </Help>
      );
    }

    AnalyticsUtils.trackEvent({
      category: AnalyticsUtils.Categories.Session,
      action: AnalyticsUtils.Actions.ViewedRelatedGrid,
      label: decodeURIComponent(this.props.match.params["id"]),
      value: captures.length
    });

    return (
      <Grid
        sessions={[]}
        captures={captures}
        emptyCapturesMessage={`We could not find anything related to your current note. Try hitting the visualize button to watch your tangle grow.`}
        headerHeight={this.props.headerHeight}
      />
    );
  }
}

const withGetRelatedCapturesBySession = graphql<
  getRelatedCapturesBySessionResponse,
  Props
>(getRelatedCapturesBySession, {
  alias: "withGetRelatedCapturesBySession",
  options: (props: Props) => ({
    variables: {
      sessionId: decodeURIComponent(props.match.params["id"]),
      count: config.resultCount
    },
    fetchPolicy: "network-only"
  })
});

const RelatedGridWithData = compose(withGetRelatedCapturesBySession)(
  RelatedGrid
);

// Export
export default RelatedGridWithData;
