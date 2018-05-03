import React, { Component } from "react";
import Helmet from "react-helmet";
import config from "../../data/SiteConfig";

import { shuffle } from "lodash";

import Profile from "../components/Team/Profile";
import Alpha from "../components/Subscribe/Alpha";

const teamMembers = [
  {
    name: "Cameron Porter",
    title: "Product Lead",
    founder: true,
    subtitle: "Lead Barista",
    link: "https://www.linkedin.com/in/cam39porter/",
    bitmoji:
      "https://storage.googleapis.com/usetangle-static-assets/team-bitmojis/cameron-porter.png"
  },
  {
    name: "Myles McGinley",
    title: "Operations Lead",
    subtitle: "Jr. Web Dev",
    founder: true,
    link: "https://www.linkedin.com/in/myles-mcginley-10708954/",
    bitmoji:
      "https://storage.googleapis.com/usetangle-static-assets/team-bitmojis/myles-mcginley.png"
  },
  {
    name: "Cole McCracken",
    title: "Engineering Lead",
    subtitle: "Head Chef",
    founder: true,
    link: "https://www.linkedin.com/in/colemccracken/",
    bitmoji:
      "https://storage.googleapis.com/usetangle-static-assets/team-bitmojis/cole-mccracken.png"
  },
  {
    name: "Will Minshew",
    title: "Adviser",
    subtitle: "The Philosopher",
    link: "https://www.linkedin.com/in/william-minshew/",
    bitmoji:
      "https://storage.googleapis.com/usetangle-static-assets/team-bitmojis/will-minshew.png"
  }
];

class TeamPage extends Component {
  render() {
    return (
      <div className={`w-90 center`}>
        <Helmet title={`Team | ${config.siteTitle}`} />
        <Alpha
          title={"Join us on the journey of the lifelong brainstorm."}
          body={
            "We could not be more excited to share Tangle with you. We believe you will enjoy building your own tangle as much as we have."
          }
        />
        <div className={`mw7 center pt6`}>
          {shuffle(teamMembers).map(teamMember => (
            <div className={`fl w-100 w-50-l`}>
              <Profile {...teamMember} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default TeamPage;
