// React
import * as React from "react";

// GraphQL
import { getSettingsQuery as getSettingsResponse } from "../../__generated__/types";
import { graphql, compose, QueryProps } from "react-apollo";
import { getSettings } from "../../queries";

// Components

const MAX_STORAGE_PER_USER = 100 * 1000 * 1000; // 100 MB

// Types
interface Props {
  data: QueryProps<{}> & Partial<getSettingsResponse>;
}

interface State {}

// Class
class DataUsage extends React.Component<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);
  }

  render() {
    const { data } = this.props;

    return (
      <div className={`pv2 flex-column justify-around f6 gray`}>
        {data.getSettings &&
          `You have used ${Math.round(
            (data.getSettings.storageUsed / MAX_STORAGE_PER_USER) * 100
          )}% of your 100 MB data limit`}
      </div>
    );
  }
}

const withGetSettings = graphql<getSettingsResponse, Props>(getSettings, {
  alias: "withGetSettings",
  options: () => ({
    fetchPolicy: "network-only"
  })
});

// Export
export default compose(withGetSettings)(DataUsage);
