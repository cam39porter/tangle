// React
import * as React from "react";

// Utils
import * as GoogleAnalytics from "react-ga";
import { assign } from "lodash";

// Types
import { RouteComponentProps } from "react-router";

enum Categories {
  Session = "session",
  Home = "home",
  Mobile = "mobile"
}

enum Actions {
  // Interaction
  ClickToCreateNewSession = "click_to_create-new_session",
  CreateCapture = "create-capture",
  ClickToCreateNewCapture = "click_to_create-new_capture",
  CreateSessionCapture = "create-session_capture",
  DeleteCapture = "delete-capture",
  DeleteSession = "delete-session",
  DeleteSessionCapture = "delete-session_capture",
  EditCapture = "edit-capture",
  EditSessionBody = "edit-session_body",
  EditSessionTitle = "edit-session_title",
  OpenSession = "open-session",
  CloseSession = "close-session",
  OpenQuickCreate = "open-quick_create",
  CloseQuickCreate = "close-quick_create",
  NavigateToGraph = "navigate_to-graph",
  NavigateFromGraph = "navigate_from-graph",
  EnterToExecuteSearch = "enter_to_execute-search",
  ClickToExecuteSearch = "click_to_execute-search",
  ClickToClearSearch = "click_to_clear-search",
  EnterToClearSearch = "enter_to_clear-search",
  FocusOnSessionCapture = "focus_on-session-capture",
  FocusOnEntity = "focus_on-entity",
  FocusOnTag = "focus_on-tag",
  FocusOnRelatedCapture = "focus_on-related_capture",
  FocusOnDirectResultCapture = "focus_on-direct_result_capture",
  ClickToSignOut = "click_to-sign_out",
  // Non Interaction
  ViewedRelatedGrid = "viewed-related_grid",
  ViewedSearchGrid = "viewed-search_grid",
  ViewedRelatedGraph = "viewed-related_graph",
  ViewedSearchGraph = "viewed-search_graph"
}

const gaOptions = {
  siteSpeedSampleRate: 100, // % of users of the app
  alwaysSendReferrer: true,
  allowAdFeatures: false,
  forceSSL: true
};

let currentUserId: string | undefined;

// Google Analytics Tracking
GoogleAnalytics.initialize("UA-121634830-1", {
  titleCase: false,
  debug: process.env.REACT_APP_ENV !== "production",
  gaOptions
});

// Set a field to track
const setUserId = (userId: string | undefined) => {
  currentUserId = userId;
  GoogleAnalytics.set({ userId: currentUserId });
};

// Track Event
const trackEvent = (event: GoogleAnalytics.EventArgs) => {
  Promise.resolve(
    GoogleAnalytics.event(assign(event, { dimension1: currentUserId }))
  );
};

// Page Tracking HOC
const withTracker = <P extends object>(Component: React.ComponentType<P>) => {
  const trackPage = page => {
    Promise.resolve(GoogleAnalytics.pageview(page));
  };

  const getPage = location => {
    let splitPath: string[] = location.pathname.split("/");
    let noIdsSplitPath = splitPath.map(part => {
      return part.includes("urn") ? ":urn" : part;
    });
    return noIdsSplitPath.join("/");
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
