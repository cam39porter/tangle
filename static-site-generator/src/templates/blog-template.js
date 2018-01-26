/*!
 * Blog Template
 */

import React from 'react'
import Link from 'gatsby-link'

import Profile from '../components/profile'

import Particles from 'react-particles-js'
import particlesConfig from '../../config/particles'

import Hexagon from 'react-hexagon'

import colors from '../../config/colors'

import dateFormat from 'dateformat'

import 'tachyons'

export default function Template({ data }) {

  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  return (
    <div className={'blog'}>

      {/* Header Particles */}
      <Particles 
        className={`vh-25 w-100`}
        params={particlesConfig}
      />

      {/* Blog Post */}

      {/* Title Header */}
      <div className={`dt w-100`}>
        {/* Title */}
        <h1 className={`dtc w-50 vh-25 bg-navy white pa4 f2-ns f3 v-mid tr`}>
          {frontmatter.title}
        </h1>

        {/* Subtitle */}
        <h1 className={`dtc w-50 vh-25 pa3 bg-white navy f3-ns f4 lh-copy v-mid tl`}>
          {frontmatter.subtitle}<br />
        </h1>
      </div>

      {/* Author Date */}
      <div className={`dt w-50-ns w-100 center`}>
        {/* Author */}
        <h1 className={`dtc w-50 bg-white navy pa4 f4-ns f5 fw5 v-mid tc`}>
          {frontmatter.author}
        </h1>

        {/* Date */}
        <h1 className={`dtc w-50 pa3 bg-navy white f5-ns f6 fw5 lh-copy v-mid tc`}>
          {dateFormat(frontmatter.date, 'longDate')}<br />
        </h1>
      </div>

      {/* Content */}
      <div className={'navy pa4 tj'}>

        {/* Tags */}
        <div className={`w-50-ns w-100 center tc flex justify-center flex-wrap`}>
          {frontmatter.tags.map(tag => (
            <span className={`pa2 ma2 f7 light-blue`} key={tag}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Body */}
        <div
          className={'measure center lh-copy'}
          dangerouslySetInnerHTML={{ __html: html }}
        />

      </div>

      {/* Footer Particles */}
      <Particles 
        className={`vh-25 w-100`}
        params={particlesConfig}
      />
    </div>
  )
}

/*!
 * GraphQL
 */

export const blogTemplateQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        date
        title
        subtitle
        author
        tags
      }
    }
  }
`