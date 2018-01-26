/*!
 * Profile Component
 */

import React from 'react'

import Hexagon from 'react-hexagon'

import colors from '../../config/colors'

import Particles from 'react-particles-js'
import particlesConfig from '../../config/particles'

import { withPrefix } from 'gatsby-link'

import { Twitter, Linkedin } from 'react-feather'

import 'tachyons'

/*!
 * Name
 */

const Name = (props) => (
  <h1 className={`dtc w-50 vh-25 bg-navy white pa4 f3-ns f4 v-mid ${props.right ? 'tl-ns tr' : 'tr-ns tl'}`}>
    {/* Name */}
    <span className={``}>{props.first}<br />
    {props.last}<br /></span>
    {/* Title */}
    <span className={`f1-ns f2 lh-title light-blue`}>{props.title}</span><br />
    {/* Social */}
    <span>
      <a href={`https://www.twitter.com/${props.twitter}`} className={`white`}>
        <Twitter className={`pa2`}/>
      </a>
      <a href={`https://www.linkedin.com/in/${props.linkedin}`} className={`white`}>
        <Linkedin className={`pa2`}/>
      </a>
    </span>
  </h1>
)

const Description = (props) => (
  <h1 className={`dtc w-50 vh-25 pa3 bg-white navy f5-ns f7 fw3-ns fw4 lh-copy v-mid tj`}>
    <p className={``}>{props.content}</p>
  </h1>
)


/*!
 * Profile
 */

const Profile = (props) => (
  <div className={`dib w-50-l w-100 vh-75 pb2 bg-white center`}>
    <article className={`w-100`}>

      {/* Picture */}
      <div className={`w-100 tc`}>
        <Hexagon 
          backgroundImage={props.pic}
          backgroundScale={1.05}
          flatTop={ true } 
          style={{
            stroke: colors.base
          }}
          className={`w-50 pa4`}
        />
      </div>

      {/* Name and Description */}
      <div className={`dw-100 vh-25`}>

        {!props.right ? 
        (
          <div className={`dt w-100`}>
            {/* Left */}
            <Name
              first={props.first}
              last={props.last} 
              title={props.title}
              right={props.right}
              twitter={props.twitter}
              linkedin={props.linkedin}
            />
            <Description 
              content={props.description}
              right={props.right}
            />
          </div>
        ) : 
        (
          <div className={`dt w-100`}>
            {/* Right */}
            <Description 
              content={props.description}
              right={props.right}
            />
            <Name
              first={props.first}
              last={props.last} 
              title={props.title}
              right={props.right}
              twitter={props.twitter}
              linkedin={props.linkedin}
            />
          </div>
        )}

      </div>
      
      <Particles 
        className={`vh-25 w-100`}
        params={particlesConfig}
      />
    </article>
  </div>
)

export default Profile