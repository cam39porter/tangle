/*!
 * This contains the primary layout all pages receive.
 */

import React from 'react'

import Link from 'gatsby-link'

import 'tachyons'

const DefaultWrapper = ({ children, data }) => (
  <div className={`avenir`}>

    {/* Header */}
    <header className={`w-100 fixed`}>

      {/* Navigation */}
      <nav className={`dt w-100 mw8 center`}>

        {/* Logo */}
        <div className={`dtc fl v-mid pa3`}>
          <Link to='/' className={`no-underline`}><h1 className={`f4-ns f5 tc-ns tl navy tracked-mega dim`}>{data.site.siteMetadata.title}</h1></Link>
        </div>

        {/* Actions */}
        <div className={`dtc v-mid tr pa3`}>
          <Link to='/team' className={`dim pa3 f6-ns f7 tracked navy no-underline ttu`}>team</Link>
          <Link to='/blog' className={`dim bg-navy pa3 shadow-5 f6-ns f7 tracked white no-underline ttu`}>blog</Link>
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
