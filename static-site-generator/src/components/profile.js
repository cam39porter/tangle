/*!
 * Profile Component
 */

import React from 'react'

import Hexagon from 'react-hexagon'

import colors from '../../config/colors'

import Particles from 'react-particles-js'
import particlesConfig from '../../config/particles'

import 'tachyons'

/*!
 * Name
 */

const Name = (props) => (
  <h1 className={`dtc w-50 vh-25 bg-navy white pa2 f3-ns f4 v-mid ${props.right ? 'tl-ns tr' : 'tr-ns tl'}`}>
    <span className={``}>{props.first}<br />
    {props.last}<br /></span>
    <span className={`f1-ns f2 lh-title light-blue`}>{props.title}</span>
  </h1>
)

const Description = (props) => (
  <h1 className={`dtc w-50 vh-25 pa3 bg-white navy f5-ns f6 ${props.right ? 'tr' : 'tl'} v-mid`}>
    {props.content}
  </h1>
)


/*!
 * Profile
 */

const Profile = (props) => (
  <div className={`dib w-50-ns w-100 vh-75 pb2 bg-white center`}>
    <article className={`w-100`}>

      {/* Picture */}
      <div className={`w-100 tc`}>
        <Hexagon 
          backgroundImage='http://tachyons.io/img/avatar_1.jpg'
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