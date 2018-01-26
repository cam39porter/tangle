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

import Typist from 'react-typist'

import 'tachyons'

export default function Template({ data }) {

  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  return (
    <div className={''}>

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
        <h1 className={`dtc w-50 vh-25 pa3 bg-white navy f3-ns f4 lh-copy v-mid tj`}>
          {frontmatter.subtitle}<br />
        </h1>
      </div>

      {/* Author Date */}
      <div className={`dt w-100`}>
        {/* Author */}
        <h1 className={`dtc w-50 vh-25 bg-navy white pa4 f2-ns f3 v-mid tr`}>
          {frontmatter.author}
        </h1>

        {/* Date */}
        <h1 className={`dtc w-50 vh-25 pa3 bg-white navy f3-ns f4 lh-copy v-mid tj`}>
          {frontmatter.date}<br />
        </h1>
      </div>

      {/* Content */}
      <div className={'navy'}>

        {/* Date */}
        {/* <span className={`f5 tr light-blue`}>
            {frontmatter.date}
        </span> */}

        {/* Body */}
        <div
          className={'measure center lh-copy'}
          dangerouslySetInnerHTML={{ __html: html }}
        />

      </div>
    </div>
  );
}

/*!
 * GraphQL
 */

export const blogQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        date
        title
        subtitle
        author
      }
    }
  }
`