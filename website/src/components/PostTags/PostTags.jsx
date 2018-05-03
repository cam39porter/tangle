import React, { Component } from "react";
import _ from "lodash";
import Link from "gatsby-link";

class PostTags extends Component {
  render() {
    const { tags } = this.props;
    return (
      <div className={``}>
        {tags &&
          tags.map(tag => (
            <div className={``}>
              <Link
                key={tag}
                style={{ textDecoration: "none" }}
                to={`/tags/${_.kebabCase(tag)}`}
              >
                <div
                  className={`ttl dib fl pv1 ph2 ma2 white f5 fw5 bg-accent br4`}
                >{`#${tag}`}</div>
              </Link>
            </div>
          ))}
      </div>
    );
  }
}

export default PostTags;
