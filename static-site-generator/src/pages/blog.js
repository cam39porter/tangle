/*!
 * Blog Posts Page
 */

import React from 'react'
import Link from 'gatsby-link'

import Profile from '../components/profile'

import Particles from 'react-particles-js'
import particlesConfig from '../../config/particles'

import Hexagon from 'react-hexagon'

import colors from '../../config/colors'

import Typist from 'react-typist'

import 'tachyons'

/*!
 * Component
 */

const BlogPage = ({ data }) => (
  <div className={'blog'}>

    `{/* Header Particles */}
    <Particles 
      className={`vh-25 w-100`}
      params={particlesConfig}
    />

    {/* List of Blog Posts */}
    {data.allMarkdownRemark.edges.map((blogPost) =>{
      return (
        <div className={`w-100`}>
          <div className={`dt w-100`} key={blogPost.node.frontmatter.path}>
            {/* Title */}
            <Link to={blogPost.node.frontmatter.path} className={`dtc shadow-5 w-50 vh-25 bg-navy white pa4 f2-ns f3 v-mid tr dim no-underline`}>
              <h1>{blogPost.node.frontmatter.title}</h1>
            </Link>

            {/* Subtitle */}
            <h1 className={`dtc w-50 vh-25 pa3 bg-white navy f4-ns f5 lh-copy tl v-mid`}>
              <span>{blogPost.node.frontmatter.subtitle}</span><br />
              {/* Tags */}
              <div className={`w-100 tc flex flex-wrap`}>
                {blogPost.node.frontmatter.tags.map(tag => (
                  <span className={`pa1 f5 light-blue ttl`} key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </h1>
          </div>

          {/* Separator */}
          <Particles 
            className={`h3 w-100`}
            params={particlesConfig}
          />
        </div>
      )
    })}
  </div>
)

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            subtitle
            tags
            date
            path
          }
        }
      }
    }
  }
`

export default BlogPage
