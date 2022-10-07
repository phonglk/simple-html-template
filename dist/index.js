
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./simple-html-template.cjs.production.min.js')
} else {
  module.exports = require('./simple-html-template.cjs.development.js')
}
