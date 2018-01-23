/*!
 * This contains the primary layout all pages receive.
 */

import React from 'react'

import Link from 'gatsby-link'

import Particles from 'react-particles-js'
import particlesUtils from '../lib/particles-utils'

import 'tachyons'

const DefaultWrapper = ({ children, data }) => (
  <div className={`avenir pa4`}>

    {/* Header */}
    <header className={``}>

      {/* Navigation */}
      <nav className={`dt w-100 mw8 center`}>

        {/* Logo */}
        <div className={`dtc w5 v-mid pa3`}>
          <h1 className={`f3 tc navy`}>{data.site.siteMetadata.title}</h1>
        </div>

        {/* Actions */}
        <div className={`dtc v-mid tr pa3`}>
          <Link className={`dim bg-navy pa3 shadow-5 f4 lightest-blue no-underline ttu`}>team</Link>
        </div>
      </nav>
    </header>

    {/* Children */}
    <div className={``}>
      { children() }
    </div>

    {/* Footer */}
  </div>
)

/*!
 * GraphQL
 */

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`

/*!
 * Exports
 */

export default DefaultWrapper
