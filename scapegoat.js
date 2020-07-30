exports.ScapeGoat = function(){
    var middlewareFunctions = []
    var options = {}
    var override = {
        status: false,
        run: undefined
    };

    var runMiddleware = function(){
        if(middlewareFunctions.length > 0){
            middlewareFunctions.forEach(func => {
                func()
            })
        }
    }

    var flattenOptions = function(){
        options.tokenProps.forEach(prop => {
            prop.symbols.forEach(symbol => {
                options.tokens[symbol] = prop.tokenName
            })
        })
        delete options.tokenProps
        console.log(options)
    }

    this.use = function(middleware){
        if(typeof middleware === "function"){
            middlewareFunctions.push(middleware)
        }else if(typeof middleware === "object"){
            options = middleware
            flattenOptions()
        }else{
            throw new Error('Invalid middleware, must be an object or function')
        }
    }

    this.override = function(overrideFunction){
        if(overrideFunction === undefined){
            console.log('or off')
            override.status = false;
            override.run = undefined
        }else{
            console.log('or on')
            override.status = true
            override.run = overrideFunction
        }
    }

    this.tokenify = function(stream, callback){
        runMiddleware()

        if(override.status){
            override.run(stream, 0, callback)
            return
        }

        var parsedTokens = []
        var properties = options.tokenProps
    
        //splitting procedure
        delimiter = options.delimiter ? options.delimiter : ''
        tokens = stream.split(delimiter)
    
        tokens.forEach(token => {
            var identifier = options.tokens[token]
            if(identifier){
                parsedTokens.push({
                    identifier: options.tokens[token],
                    value: token
                })
            }else{
                parsedTokens.push({
                    identifier: 'KeyWord',
                    value: token
                })
            }
        })
        
        parsedTokens.push({
            identifier: 'EOF', 
            value: 'EOF'
        })

        if (callback) { callback(null, tokens) }

        //id procedure 
        /*
        tokens.forEach((token, tokenIndex) => {
            properties.forEach(property => {
                property.symbols.forEach(symbol => {
                    if(symbol == token){
                        tokens[tokenIndex] = {
                            identifier: property.tokenName,
                            value: symbol
                        }
                    }
                })
            })
    
            if(tokens[tokenIndex].identifier === undefined && token != ' ' && options.skipWhiteSpace){
                tokens[tokenIndex] = {
                    identifier: 'KeyWord',
                    value: token
                }
            }
        })
    */
    }
} 