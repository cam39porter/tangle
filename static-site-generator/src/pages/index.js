/*!
 * Home Page
 */

import React from 'react'
import Link from 'gatsby-link'

import Particles from 'react-particles-js'
import particlesConfig from '../../config/particles'

import Typist from 'react-typist'

import MathJax from 'react-mathjax'

import 'tachyons'

/*!
 * Component
 */

const IndexPage = () => (
  <div>
    {/* Title Page */}
    <div className={`vh-100`}>

      {/* Network Background */}
      <Particles 
        className={`fl vh-100 w-100`}
        params={particlesConfig}
      />

      {/* Headline */}
      <div className={`dt absolute bottom-2 vh-75 w-100 center`}>
        <div className={`dtc`}>

          {/* Left Phrase */}
          <h1 className={`dib absolute top-2 left-0 w-50 bg-navy white pa5-ns pa4 f2-ns f4 tr-ns tl v-mid`}>
            <span>Next level </span><span className={`underline`}>knowledge<br/>management</span>
          </h1>

          {/* Right Phrase */}
          <h1 className={`dib absolute top-2 right-0 w-50 navy pa5-ns pa4 f2-ns f4 tl v-mid`}>
            <Typist
              cursor={{
                show: true,
                blink: true,
                element: '|',
                hideWhenDone: true,
                hideWhenDoneDelay: 0,
              }}
            >
              <span className={`f2-ns f4`}>for the teams of the future</span>
              <Typist.Backspace count={19} delay={1000} />
              <span className={`f2-ns f4`}>executive with vision</span>
              <Typist.Backspace count={25} delay={1000} />
              <span className={`f-headline-ns f1 light-blue tracked-mega`}>YOU</span>
            </Typist>
          </h1>
        </div>
      </div>
      
      {/* Message Button */}
      <div className={`dtc mb5 absolute bottom-2 tc w-100`}>
        <MathJax.Context>
            <div className={`mw-1 pa4 tracked navy ttu`}>
              <p className={`f6-ns f7`}>Ask us about our formula ;)</p>
              <div className={`f3`}>
                <MathJax.Node>
                  {`U(f) \\propto K ( v |K|^{\\beta} - c)`}
                </MathJax.Node>
              </div>
            </div>
        </MathJax.Context>
        <a href='mailto:cam@hex.ventures?subject=Hello%20Hex!' target='_top' className={`mw-1 dim bg-navy pa3 shadow-5 f6-ns f7 tracked white no-underline ttu`}>message</a>
      </div>
    </div>
  </div>
)

export default IndexPage
