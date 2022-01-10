# rem2px-loader
webpack rem2px rem2rem loader

## Installation

Run `npm install rem2px-loader --save-dev`

## Usage

```js
import rem2px from 'rem2px-loader';

module: {
  rules: [{
    test: /\.css$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'rem2px-loader',
        options: {
          transformType: 'px',   // rem transform dest type : 'px' | 'rem' (default: 'px')
          sdw: 1920,        // src css design width (default: 1920)
          ddw: 1920,       // dest css design width (default: 1920)
          srfs: 100,  // src root fontsize value (default: 100)
          drfs: 100, // dest root fontsize value (default: 100)
          forbidComment: 'no',   // no transform value comment (default: `no`)
          precision: 4,          // transformed px or rem precision
          remLimit: 0            // no transform rem limit（default: 0）
        }
      }
    ]
  }]
}
```

rem2px: srcRemValue * srfs * (ddw / sdw)

rem2rem: srcRemValue * srfs * (sdw / ddw) / drfs

# License
MIT © 2022 Duzhijie Inc.
