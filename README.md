# Introduction

Simple HTML Template Language
We are not trying to create new XML Language but extend the HTML to specific use case

![Diagram](https://raw.githubusercontent.com/phonglk/simple-html-template/master/diagram.png)

# API

```<include src="<path to html file>" />```

Content of the file will replace <include ... /> tag
If there are tabs/spaces before included tag. Every line of 'content' will be prefixed by same spaces/tabs
## CLI
There are 2 exposed executable
### Compile
```./node_modules/.bin/sht-cli ./html```

### Watch and compile
```./node_modules/.bin/sht-cli-watch ./html```

OR

package.json
{
  "scripts": {
    "compile-template": "sht-cli ./html",
    "watch-template": "sht-cli-watch ./html"
  }
}
## Configuration
To customise output of the compilation, please place sht.config.json inside the template folder (such as "./html")

Please take a look at example/html/sht.config.json for example

Default configuration:
`
{
  "outDir": "./compiled",
  "ignores": [/^partial$/, /^compiled$/, /\.compiled\.html$/],
  "include": /\.html$/,
}
`

#Why I made this

This is simple, just do one job and try to do good: reuse html partials

This especially useful for who do the Slicing PSD to HTML Jobs

After all, there is no abnormal syntax that broke your html file. Just pure HTML with a little bit automation to connect partials together.

#Example
```node ./lib/cli.js ./example/html/```

# Test
```npm test```

## TDD
```npm run test-dev```

## Test coverage
```npm run coverage```

