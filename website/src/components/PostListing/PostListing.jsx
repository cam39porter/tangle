import React from "react";
import { navigateTo } from "gatsby-link";

import Alpha from "../Subscribe/Alpha";

class PostListing extends React.Component {
  getPostList() {
    const postList = [];
    this.props.postEdges.forEach(postEdge => {
      postList.push({
        path: postEdge.node.fields.slug,
        tags: postEdge.node.frontmatter.tags,
        cover: postEdge.node.frontmatter.cover,
        title: postEdge.node.frontmatter.title,
        date: postEdge.node.frontmatter.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead
      });
    });
    return postList;
  }
  render() {
    const postList = this.getPostList();
    return (
      <div className={`w-90 center`}>
        <Alpha title={"The blog is just the beginning."} body={"If you enjoy what you see here, we bet you will love what we are building. Just click the button and not only will you be at the front of the line for exclusive access to Tangle, we will send you updates on our progress and new content"}/>
        {/* List of Posts */
        postList.map((post, index) => (
          <div
            className={`relative center ba br4 b--light-gray pv4 ph3 pa4-l measure mv5 grow pointer`}
            onClick={() => {
              navigateTo(post.path);
            }}
            key={`${post.title}${index}`}
          >
            <div
              className={`f7 absolute br4 top--1 right--1 bg-accent white pv2 ph3`}
            >
              {post.timeToRead} mins
            </div>

            <div className={`f4 fw5 lh-copy dark-gray pb4`}>{post.title}</div>
            <div className={`f6 fw3 lh-copy gray pb4`}>{post.excerpt}</div>
            <div
              className={`f7 absolute br4 bottom-0 right-0 moon-gray pv2 ph3`}
            >
              {post.date}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default PostListing;
