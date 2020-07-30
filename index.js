/*
const { ScapeGoat } = require('./scapegoat')
var scapegoat = new ScapeGoat()

scapegoat.use(() => {
    console.log('marker')
})

scapegoat.use({
    tokenProps: [
        {tokenName: 'EOF',              symbols: ['EOF']},
        {tokenName: 'Operator',         symbols: ['+','-','*','/','=',')','(','}','{',';']},
        {tokenName: 'Number',           symbols: ['0','1','2','3','4','5','6','7','8','9']},
        {tokenName: 'ReservedWord',     symbols: ['echo', 'var']}
    ],

    tokens: [],
    delimiter: ' ',
    skipWhiteSpace: true
})

var expression = `var x = 2 ; var y = 3 ; echo ( x + y ) ;`

//creates tokenify override
scapegoat.override((stream, currentIndex, callback) => {
    console.log('tokenify has been overridden')
    if(callback){callback(null, [])}
})

scapegoat.override() // undoes the override

scapegoat.tokenify(expression, (err, tokens) => {
    if (err) throw err
    console.log(tokens)
})

*/


var obj = {
    props: [
        {tokenName: 'EOF',              symbols: ['EOF']},
        {tokenName: 'Operator',         symbols: ['+','-','*','/','=',')','(','}','{',';']},
        {tokenName: 'Number',           symbols: ['0','1','2','3','4','5','6','7','8','9']},
        {tokenName: 'ReservedWord',     symbols: ['echo', 'var']}
    ]
}

obj.props.forEach(prop => {
    prop.symbols.forEach(symbol => {
        obj[symbol] = prop.tokenName
    })
})
delete obj.props

console.log(obj)

