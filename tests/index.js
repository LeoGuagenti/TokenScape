const { TokenScape } = require('../tokenscape')
var tokenscape = new TokenScape()

//middleware functions
tokenscape.use(() => {
    console.log('middleware function 1')
})

tokenscape.use(() => {
    console.log('middleware function 2')
})

tokenscape.use({
    tokenProps: [
        {tokenName: 'vowel',         symbols: ['a','e','i','o','u','y']},
        {tokenName: 'consonant',     symbols: ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','z',]},
    ],
    
    delimiter: ' ',
    defaultToken: 'ERROR',
    eof: true
})

var expression = `abc d3z`

//creates tokenify override
tokenscape.override((stream, callback) => {
    console.log('tokenify has been overridden')
    if(callback){callback(null, ['override', 'tokens'])}
})

tokenscape.override() // undoes the override

//using a callback
tokenscape.tokenify(expression, (err, tokens) => {
    if (err) console.log(`We got a live one: ${err}`)
    console.log(tokens)
})

//using promises
tokenscape.tokenify(expression)
    .then((tokens) => {
        console.log(tokens)
    })
    .catch((err) => {
        console.log(err)
    })