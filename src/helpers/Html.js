/* eslint react/no-danger: "off" */
/* eslint global-require: "off" */
/* eslint import/no-dynamic-require: "off" */
/* eslint no-underscore-dangle: "off" */

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom/server'
import serialize from 'serialize-javascript'
import Helmet from 'react-helmet'

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object,
  }

  render() {
    const { assets, component, store } = this.props
    const content = component ? ReactDOM.renderToString(component) : ''
    const head = Helmet.rewind()

    return (
      <html lang="en">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <link rel="shortcut icon" href="/favicon.ico?v=3" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" />
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" />


          {/* --- production mode --- */}
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).length !== 0 ?
           Object.keys(assets.styles).map(style => (
             <link
               href={assets.styles[style]} key={style} media="screen, projection"
               rel="stylesheet" type="text/css" charSet="UTF-8"
             />
          )) : null}

          {/* --- development mode --- */}
          {/* outputs a <style/> tag with all required css files. */}
          {Object.keys(assets.styles).length === 0 ?
            Object.keys(assets.assets).filter(it => (
              /* only css assets */
              it.slice(-5) === '.scss'
            )).map(it => (
              <style key={it} dangerouslySetInnerHTML={{ __html: require(`../../${it}`)._style }} />
            ))
            :
            null
          }
        </head>
        <body>
          <div id="content" style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: content }} />
          <script dangerouslySetInnerHTML={{ __html: `window.processedStore=${serialize(store.getState())};` }} charSet="UTF-8" />
          <script src={assets.javascript.main} charSet="UTF-8" />
        </body>
      </html>
    )
  }
}