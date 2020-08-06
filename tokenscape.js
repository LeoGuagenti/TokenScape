exports.TokenScape = function(){
    var middlewareFunctions = []
    var options = {}
    var override = {
        status: false,
        run: undefined
    };

    // PRIVATE FUNCTIONS
    var runMiddleware = function(){
        if(middlewareFunctions.length > 0){
            middlewareFunctions.forEach(func => {
                func()
            })
        }
    }

    var flattenOptions = function(){
        try{
            options.tokenProps.forEach(prop => {
                prop.symbols.forEach(symbol => {
                    options[symbol] = prop.tokenName
                })
            })
            delete options.tokenProps
        }catch(err){
            throw new Error //throw general then specific
        }
        
    }
        
    var parseStream = function(stream){
        var parsedTokens = []
        var currentToken = ''
        var charIndex = 0

        for(charIndex; charIndex < stream.length; charIndex++){
            if(stream[charIndex] == options.delimiter || stream[charIndex] == '\n' || stream[charIndex] == '\t'){
                if(options.hasOwnProperty(currentToken)){
                    parsedTokens.push({
                        identifier: options[currentToken],
                        value: currentToken
                    })
                }else{
                    if(currentToken != ''){
                        parsedTokens.push({
                            identifier: options.defaultToken,
                            value: currentToken
                        })
                    }
                }

                currentToken = ''
                continue
            }

            if(options.hasOwnProperty(stream[charIndex])){
                if(currentToken != ''){
                    parsedTokens.push({
                        identifier: options.defaultToken,
                        value: currentToken
                    })
                    currentToken = ''
                }
                
                parsedTokens.push({
                    identifier: options[stream[charIndex]],
                    value: stream[charIndex]
                })
            }else{
                currentToken += stream[charIndex]
            }
        }

        if(currentToken != ''){
            parsedTokens.push({
                identifier: options.defaultToken,
                value: currentToken
            })
        }

        return parsedTokens
    }


    // PUBLIC FUNCTIONS
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
            override.status = false; 
            override.run = undefined
        }else{
            override.status = true; 
            override.run = overrideFunction
        }
    }

    this.tokenify = function(stream, callback){
        runMiddleware()

        if(override.status){
            override.run(stream, callback)
            return
        }

        var tokens = parseStream(stream)

        if(options.eof){
            tokens.push({
                identifier: 'EOF', 
                value: 'EOF'
            })
        }
        
        if (callback) { callback(null, tokens) }
    }
} 
