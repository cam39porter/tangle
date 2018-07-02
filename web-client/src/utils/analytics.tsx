// React
import * as React from "react";

// Utils
import * as GoogleAnalytics from "react-ga";

// Types
import { RouteComponentProps } from "react-router";

const gaOptions = {
  siteSpeedSampleRate: 100, // % of users of the app
  alwaysSendReferrer: true,
  allowAdFeatures: false,
  forceSSL: true,
  titleCase: false
};

// Google Analytics Tracking
GoogleAnalytics.initialize("UA-121634830-1", {
  debug: process.env.REACT_APP_ENV !== "production",
  gaOptions
});

// Page Tracking HOC
const withTracker = <P extends object>(Component: React.ComponentType<P>) => {
  const trackPage = page => {
    GoogleAnalytics.pageview(page);
  };

  const getPage = location => {
    return location.pathname + location.search;
  };

  interface WithTrackerProps extends RouteComponentProps<{}> {}

  return class extends React.Component<WithTrackerProps & P> {
    componentDidMount() {
      const page = getPage(this.props.location);
      trackPage(page);
    }

    componentWillReceiveProps(nextProps: WithTrackerProps & P) {
      const currentPage = getPage(this.props.location);
      const nextPage = getPage(nextProps.location);

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  };
};

export default {
  GoogleAnalytics,
  withTracker
};
