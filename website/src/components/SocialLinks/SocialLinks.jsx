import React, { Component } from "react";
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  RedditShareButton,
  FacebookShareCount,
  GooglePlusShareCount,
  LinkedinShareCount,
  RedditShareCount,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  GooglePlusIcon,
  LinkedinIcon,
  RedditIcon
} from "react-share";
import config from "../../../data/SiteConfig";

class SocialLinks extends Component {
  render() {
    const { postNode, postPath, mobile } = this.props;
    const post = postNode.frontmatter;
    const realPrefix = config.pathPrefix === "/" ? "" : config.pathPrefix;
    const url = config.siteUrl + realPrefix + postPath;

    const iconSize = mobile ? 36 : 48;
    const filter = count => (count > 0 ? count : "");

    return (
      <div className={`w-100 dt pa4`}>
        <div className={`dtc`}>
          <RedditShareButton url={url} title={post.title}>
            <RedditIcon round size={iconSize} />
            <RedditShareCount url={url}>
              {count => <div className={``}>{filter(count)}</div>}
            </RedditShareCount>
          </RedditShareButton>
        </div>
        <div className={`dtc`}>
          <TwitterShareButton url={url} title={post.title}>
            <TwitterIcon round size={iconSize} />
          </TwitterShareButton>
        </div>

        <div className={`dtc`}>
          <FacebookShareButton url={url} quote={postNode.excerpt}>
            <FacebookIcon round size={iconSize} />
            <FacebookShareCount url={url}>
              {count => <div className={``}>{filter(count)}</div>}
            </FacebookShareCount>
          </FacebookShareButton>
        </div>
        <div className={`dtc`}>
          <LinkedinShareButton
            url={url}
            title={post.title}
            description={postNode.excerpt}
          >
            <LinkedinIcon round size={iconSize} />
            <LinkedinShareCount url={url}>
              {count => <div className={``}>{filter(count)}</div>}
            </LinkedinShareCount>
          </LinkedinShareButton>
        </div>
      </div>
    );
  }
}

export default SocialLinks;
