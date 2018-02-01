/*!
 * Subscribe Component
 */

import React from 'react'

import colors from '../../config/colors'

import Link from 'gatsby-link'

import Particles from 'react-particles-js'
import particlesConfig from '../../config/particles'

import 'tachyons'

/*!
 * Subscribe
 */

const Subscribe = (props) => (
  <div>
    <div className={`dt w-100`}>
      {/* Left */}
      <a href={`http://eepurl.com/djoBb5`} className={`dtc shadow-5 w-50 vh-25 bg-navy white pa4 v-mid tr dim no-underline pointer`}>
        <h1 className={`f2-ns f3 light-blue`}>Subscribe</h1>
      </a>

      {/* Right */}
      <h1 className={`dtc w-50 vh-25 pa3 bg-white navy f4-ns f5 lh-copy tl v-mid`}>
        <span></span><br />
        {/* Tags */}
        <div className={`w-100 tl flex flex-wrap`}>
          Join our weekly newsletter for updates from us, our blog, and a selection of one podcast, one video, and one article that captured our attention.
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

export default Subscribe