// React
import * as React from "react";

// Utils
import * as GoogleAnalytics from "react-ga";

// Types
import { RouteComponentProps } from "react-router";

enum Categories {
  Test = "test"
}

enum Actions {
  CreateSession = "create-session",
  CreateCapture = "create-capture",
  CreateSessionCapture = "create-session_capture",
  DeleteCapture = "delete-capture",
  DeleteSession = "delete-session",
  DeleteSessionCapture = "delete-session_capture",
  EditCapture = "edit-capture",
  EditSessionCapture = "edit-session_capture",
  EditSessionTitle = "edit-session_title",
  NavigateToSession = "navigate_to-session",
  NavigateFromSession = "navigate_from-session",
  NavigateToCreateCapture = "navigate_to-create-capture",
  NavigateToCreateSession = "navigate_to-create-session",
  NavigateFromCreateCapture = "navigate_from-create-capture",
  NavigateToGraph = "navigate_to-graph",
  NavigateFromGraph = "navigate_from-graph",
  NavigateToSearch = "navigate_from-search",
  NavigateFromSearch = "navigate_from-search",
  NavigateToTag = "navigate_to-tag",
  NavigateToEntity = "navigate_to-entity",
  NavigateToCapture = "navigate_to-capture",
  SignOut = "sign_out"
}

const gaOptions = {
  siteSpeedSampleRate: 100, // % of users of the app
  alwaysSendReferrer: true,
  allowAdFeatures: false,
  forceSSL: true
};

// Google Analytics Tracking
GoogleAnalytics.initialize("UA-121634830-1", {
  titleCase: false,
  debug: process.env.REACT_APP_ENV !== "production",
  gaOptions
});

// Set a field to track
const setUserId = (userId: string | undefined) => {
  GoogleAnalytics.set({ userId });
};

// Track Even
const trackEvent = (event: GoogleAnalytics.EventArgs) => {
  Promise.resolve(GoogleAnalytics.event(event));
};

// Page Tracking HOC
const withTracker = <P extends object>(Component: React.ComponentType<P>) => {
  const trackPage = page => {
    Promise.resolve(GoogleAnalytics.pageview(page));
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
  setUserId,
  trackEvent,
  withTracker,
  Categories,
  Actions
};
