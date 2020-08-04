const { ScapeGoat } = require('./scapegoat')
var scapegoat = new ScapeGoat()

//middleware functions
scapegoat.use(() => {
    console.log('middleware function 1')
})

scapegoat.use({
    tokenProps: [
        {tokenName: 'EOF',              symbols: ['EOF']},
        {tokenName: 'Operator',         symbols: ['+','-','*','/','=',')','(','}','{',';']},
        {tokenName: 'Number',           symbols: ['0','1','2','3','4','5','6','7','8','9']},
        {tokenName: 'ReservedWord',     symbols: ['echo', 'var']}
    ],
    
    whiteSpace: true
})

var expression = `var x = 2 ; var y = 3 ; echo ( x + y ) ;`

//creates tokenify override
scapegoat.override((stream, callback) => {
    console.log('tokenify has been overridden')
    if(callback){callback(null, ['override', 'tokens'])}
})

scapegoat.override() // undoes the override

scapegoat.tokenify(expression, (err, tokens) => {
    if (err) throw err
    console.log(tokens)
})