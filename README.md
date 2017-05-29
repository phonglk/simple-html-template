# Introduction

Simple HTML Template Language and parser.

![Diagram](https://raw.githubusercontent.com/phonglk/simple-html-template/master/diagram.png)

# API

```<include src="<path to html file>" />```

Content of the file will replace <include ... /> tag
If there are tabs/spaces before include tag. Every line of 'content' will be prefixed by same spaces/tabs

# Usage

```sht-cli <folder>```

# Example
node ./lib/cli.js ./example/html/

# Test
```npm test```

## TDD
```npm run test-dev```

## Test coverage
```npm run coverage```

