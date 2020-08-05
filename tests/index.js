const { TokenScape } = require('../tokenscape')
var tokenscape = new TokenScape()

//middleware functions
tokenscape.use(() => {
    console.log('middleware function 1')
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

var expression = `abcdefghijkl+mnopqrstuvwxyz`

//creates tokenify override
tokenscape.override((stream, callback) => {
    console.log('tokenify has been overridden')
    if(callback){callback(null, ['override', 'tokens'])}
})
tokenscape.override() // undoes the override

tokenscape.tokenify(expression, (err, tokens) => {
    if (err) throw err
    console.log(tokens)
})