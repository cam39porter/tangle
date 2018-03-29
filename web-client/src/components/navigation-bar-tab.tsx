import * as React from "react";

import { Link } from "react-router-dom";

import { withRouter, RouteComponentProps } from "react-router";

interface Props extends RouteComponentProps<Object> {
  title: string;
  isActiveBackgroundColor: string;
  isActiveColor: string;
}

interface State {
  isActive: boolean;
}

class NavigationBarTab extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.isMatch = this.isMatch.bind(this);

    this.state = {
      isActive: false
    };
  }

  isMatch() {
    if (this.props.location.pathname.startsWith(`/${this.props.title}`)) {
      return true;
    }
    if (
      this.props.title === "capture" &&
      this.props.location.pathname === "/"
    ) {
      return true;
    }
    return false;
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
