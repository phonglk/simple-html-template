#Introduction

Simple HTML Template Language and parser.

#API

<include src="<path to html file>" />

Content of the file will replace <include ... /> tag
If there are tabs/spaces before include tag. Every line of 'content' will be prefixed by same spaces/tabs

#Example
node ./lib/cli.js ./example/html/

#Test
```npm test```

## TDD
```npm run test-dev```

## Test coverage
```npm run coverage```

