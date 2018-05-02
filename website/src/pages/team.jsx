import React, { Component } from "react";
import Helmet from "react-helmet";
import config from "../../data/SiteConfig";

class TeamPage extends Component {
  render() {
    return (
      <div className={`w-100 pt4`}>
        <Helmet title={`Team | ${config.siteTitle}`} />
      </div>
    );
  }
}

export default TeamPage;
