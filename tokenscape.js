exports.TokenScape = function(){
    var middlewareFunctions = []
    var options = {}
    var override = {
        status: false,
        run: undefined
    };

    // PRIVATE FUNCTIONS

    //token object template
    var Token = function(identifier, value){
        return {
            identifier: identifier,
            value: value
        }
    }

    //runs each middleware function in the order they were added
    var runMiddleware = function(){
        if(middlewareFunctions.length > 0){
            middlewareFunctions.forEach(func => {
                func()
            })
        }
    }

    //converts multi-level object into a "dictionary" for easy lookups
    var flattenOptions = function(){
        try{
            options.tokenProps.forEach(prop => {
                prop.symbols.forEach(symbol => {
                    options[symbol] = prop.tokenName
                })
            })
            delete options.tokenProps
        }catch(err){
            return new Error(`A problem was encountered while trying to flatten token properties\n ${err}`)
        }
        
    }
    
    /** Breaks a string into "chunks" (tokens)
     * @param {string} stream string any string that will be broken into tokens based on the default tokenify function
     * @return an array of token objects
    */
    var parseStream = function(stream){
        var parsedTokens = []
        var currentToken = ''
        var charIndex = 0

        for(charIndex; charIndex < stream.length; charIndex++){
            if(stream[charIndex] == options.delimiter || stream[charIndex] == '\n' || stream[charIndex] == '\t'){
                if(options.hasOwnProperty(currentToken)){
                    parsedTokens.push(Token(options[currentToken], currentToken))
                }else{
                    if(currentToken != ''){
                        parsedTokens.push(Token(options.defaultToken, currentToken))
                    }
                }

                currentToken = ''
                continue
            }

            if(options.hasOwnProperty(stream[charIndex])){
                if(currentToken != ''){
                    parsedTokens.push(Token(options.defaultToken, currentToken))
                    currentToken = ''
                }
                
                parsedTokens.push(Token(options[stream[charIndex]], stream[charIndex]))
            }else{
                currentToken += stream[charIndex]
            }
        }

        if(currentToken != ''){
            parsedTokens.push(Token(options.defaultToken, currentToken))
        }

        return parsedTokens
    }


    // PUBLIC FUNCTIONS
    /**
     * Adds a middlware function to the pipeline or sets configuration.
     * @param {object / function} middleware an object that will serve as middleware or general configuration
     */
    this.use = function(middleware){
        if(typeof middleware === "function"){
            middlewareFunctions.push(middleware)
        }else if(typeof middleware === "object"){
            options = middleware
            flattenOptions()
        }else{
            throw new Error('Invalid middleware, must be an valid object or function')
        }
    }

    /**
     * Toggles a tokenify override function that may be user defined.
     * If not provided with an override function, the default tokenify function is used
     * @param {function} overrideFunction the function that overrides the defualt tokenify function
     */ 
    this.override = function(overrideFunction){
        if(overrideFunction === undefined){
            override.status = false; 
            override.run = undefined
        }else{
            override.status = true; 
            override.run = overrideFunction
        }
    }

    /**
     * Breaks a string into "chunks" (tokens) then returns the tokens in the form of a callback or promise
     * @param {string} stream an expression to be turned into tokens
     * @param {function} callback a function to be ran after completion of the tokenify function
     */
    this.tokenify = function(stream, callback){
        runMiddleware()
        
        const promise = new Promise((resolve, reject) => {
            try{
                var tokens = [];
                if(override.status){
                    tokens = override.run(stream)
                }else{
                    tokens = parseStream(stream)
                }

                if(options.eof){
                    tokens.push({
                        identifier: 'EOF', 
                        value: 'EOF'
                    })
                }

                resolve(tokens)
            }catch(error){
                reject(error)
            }
        })

        if (callback && typeof callback == 'function') {
            promise.then(
                tokens => {
                    callback(null, tokens)
                }, 
                err => {
                    callback(err, null)
                }
            )
        }else{
            return promise
        }
    }
} 