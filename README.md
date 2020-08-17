# TokenScape
![tokenscape version](https://img.shields.io/badge/npm-v1.2.0-blue)
## Description
TokenScape is a small npm package that allows you to break a string into chuncks (tokens) by defining token types and what they represent. Examples of usage are show below.
## Installation
```bash
npm i tokenscape
```
## Usage
You may use this package in your project by using the following:
```javascript
const { TokenScape } = require('../tokenscape')
var tokenscape = new TokenScape()
```

### Defining Tokens
Below is an example where I have defined all the letters in the alphabet to their corresponding 'vowel' or 'consonant' pairing.
```javascript
tokenscape.use({
    tokenProps: [
        {tokenName: 'vowel',         symbols: ['a','e','i','o','u','y']},
        {tokenName: 'consonant',     symbols: ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','z',]},
    ],
    
    delimiter: ' ',        // default stream break
    defaultToken: 'ERROR', // if token is not found
    eof: false             // addition of 'end of file' token at end of token stream
})
```
Using this configuration on a string of letters will yeild an array of objects containing the letter value and their corresponding token type.

### Making Tokens
Token divisions are based on the properties user-defined properties above. The `tokenify` function allow for the use of a callback or promise.
To use `tokenify` with a callback, do the following:
```javascript
const expression = `abcd3z`
tokenscape.tokenify(expression, (err, tokens) => {
    if (err) throw err
    console.log(tokens)
})
```
To use `tokenify` with a promise, do the following:
```javascript
const expression = `abcd3z`
tokenscape.tokenify(expression)
    .then(tokens => {
        console.log(tokens)
    })
    .catch(error => {
        console.log(error)
    })
```
Upon running, an array of tokens will be returned to the specified call back under the variable name `tokens`. Additionally, any errors that may have occured while running may be handled here.<br>
The token array should look like this:
```javascript
  { identifier: 'vowel', value: 'a' },
  { identifier: 'consonant', value: 'b' },
  { identifier: 'consonant', value: 'c' },
  { identifier: 'consonant', value: 'd' },
  { identifier: 'ERROR', value: '3' },
  { identifier: 'consonant', value: 'z' }
```
With the `eof` property set to true:
```javascript
  { identifier: 'vowel', value: 'a' },
  { identifier: 'consonant', value: 'b' },
  { identifier: 'consonant', value: 'c' },
  { identifier: 'consonant', value: 'd' },
  { identifier: 'ERROR', value: '3' },
  { identifier: 'consonant', value: 'z' },
  { identifier: 'EOF', value: 'EOF'}
```

### Token Making Overrride
TokenScape gives you the option of overriding the default token-making function with your own. To achieve this:
```javascript
tokenscape.override(stream => {
    console.log('tokenify has been overridden')
    //do some fancy dividing
})
```
If for any reason you need to turn off the override, that may be done simply by
```javascript
tokenscape.override()
```
Warning: doing this will results in any previously defined overrides being lost.

### Middleware Functions
TokenScape gives you the option to add middleware functions that always run `first` upon calling the `tokenify` function. To add a middleware function, simply do the following.
```javascript
tokenscape.use(() => {
    console.log('middleware function! #1')
})

tokenscape.use(() => {
    console.log('middleware function! #1')
})
```
Middleware functions are run in order by with they are 'added' to TokenScape. The resulting output if the above middleware functions would be:
```
middleware function! #1
middleware function! #2
```

## About this Project
This is my first npm package so any and all feedback is welcome. I hope to add more features and functionality to this project as time goes on.
