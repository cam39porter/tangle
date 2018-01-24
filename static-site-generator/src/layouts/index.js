/*!
 * This contains the primary layout all pages receive.
 */

import React from 'react'

import Link from 'gatsby-link'

import 'tachyons'

const DefaultWrapper = ({ children, data }) => (
  <div className={`avenir`}>

    {/* Header */}
    <header className={``}>

      {/* Navigation */}
      <nav className={`dt w-100 mw9 center ph6`}>

        {/* Logo */}
        <div className={`dtc fl w6 v-mid pa3`}>
          <h1 className={`f4 tc navy tracked-mega`}>{data.site.siteMetadata.title}</h1>
        </div>

        {/* Actions */}
        <div className={`dtc v-mid tr pa3`}>
          <Link className={`dim bg-navy pa3 shadow-5 f6 tracked lightest-blue no-underline ttu`}>team</Link>
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
