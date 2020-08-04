exports.ScapeGoat = function(){
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
        for(var index = 0; index < stream.length; index++){
            //function to eat specific type of data
        }

        return stream.split(' ')
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

        //container for final tokens
        var parsedTokens = []
    
        //splitting procedure
        // var delimiter = options.delimiter ? options.delimiter : ''
        // var tokens = stream.split(delimiter) // create a more dynamic way of doing this

        var tokens = parseStream(stream)
    
        tokens.forEach(token => {
            var identifier = options[token]
            if(identifier){
                parsedTokens.push({
                    identifier: options[token],
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

        if (callback) { callback(null, parsedTokens) }
    }
} 