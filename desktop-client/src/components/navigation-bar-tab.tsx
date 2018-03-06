import * as React from "react";

import { Link } from "react-router-dom";

import { withRouter, RouteComponentProps } from "react-router";

export interface Props extends RouteComponentProps<Object> {
  title: string;
  isActiveBackgroundColor: string;
  isActiveColor: string;
}

export interface NavigationBarTabState {
  isActive: boolean;
}

class NavigationBarTab extends React.Component<Props, NavigationBarTabState> {
  constructor(props: Props) {
    super(props);

    this.isMatch = this.isMatch.bind(this);

    this.state = {
      isActive: false
    };
  }

  isMatch() {
    return (
      this.props.location.pathname === `/${this.props.title}` ||
      (this.props.title === "capture" && this.props.location.pathname !== "")
    );
  }

  render() {
    return (
      <Link
        to={`/${this.props.title}`}
        style={{
          textDecoration: "none"
        }}
      >
        <div
          className={`tc pointer pa3 ttl ${
            this.isMatch()
              ? "bg-" + this.props.isActiveBackgroundColor
              : "bg-light-gray"
          }`}
        >
          <span
            className={`${this.isMatch() ? this.props.isActiveColor : "gray"}`}
          >
            {this.props.title}
          </span>
        </div>
      </Link>
    );
  }
}

export default withRouter(NavigationBarTab);
