import PropTypes from 'prop-types';
import React from 'react';

class MainPage extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    webpackManifest: PropTypes.object,
    styles: PropTypes.arrayOf(PropTypes.string),
    scripts: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    title: 'WSER Data',
    webpackManifest: {},
    styles: [],
    scripts: [],
  }

  render() {
    const {title, webpackManifest, styles, scripts} = this.props;

    /* eslint-disable  max-len */
    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <meta content="IE=edge,chrome=1" httpEquiv="X-UA-Compatible"/>
          <meta content="width=device-width,initial-scale=1.0" name="viewport"/>
          <meta content={(new Date).toISOString()} name="timestamp"/>
          <title>{title}</title>
          <script dangerouslySetInnerHTML={{__html: "window.Promise || document.write('\\x3Cscript src=\"/es6-promise.min.js\">\\x3C/script>\\x3Cscript>ES6Promise.polyfill()\\x3C/script>')"}}/>
          <script dangerouslySetInnerHTML={{__html: "window.fetch || document.write('\\x3Cscript src=\"/fetch.min.js\">\\x3C/script>')"}}/>
          <script dangerouslySetInnerHTML={{__html: 'window.webpackManifest = ' + JSON.stringify(webpackManifest)}}/>
          {styles.map(s => <link href={s} key={s} rel="stylesheet"/>)}
          <link crossOrigin="anonymous" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" rel="stylesheet" />
        </head>
        <body>
          <div id="app"/>
          {scripts.map(s => <script key={s} src={s}/>)}
        </body>
      </html>
    );
    /* eslint-enable  max-len */
  }
}

export default MainPage;
