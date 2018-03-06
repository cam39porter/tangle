import * as React from "react";

import { NavLink } from "react-router-dom";

export interface Props {
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

    this.state = {
      isActive: false
    };
  }

  render() {
    return (
      <NavLink
        to={`/${this.props.title}`}
        style={{
          textDecoration: "none"
        }}
        isActive={(match, location) => {
          if (match) {
            if (!this.state.isActive) {
              this.setState({
                isActive: true
              });
            }
            return true;
          }

          if (this.state.isActive) {
            this.setState({
              isActive: false
            });
          }
          return false;
        }}
      >
        <div
          className={`tc pointer pa3 ttl ${
            this.state.isActive
              ? "bg-" + this.props.isActiveBackgroundColor
              : "bg-light-gray"
          }`}
        >
          <span
            className={`${
              this.state.isActive ? this.props.isActiveColor : "gray"
            }`}
          >
            {this.props.title}
          </span>
        </div>
      </NavLink>
    );
  }
}

export default NavigationBarTab;
