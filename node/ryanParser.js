(function() {
    var parseStatements = function(content){
        var parts = [];
        var splitContent = content.split("@(");
       
        parts.push(splitContent[0]);
       
        for(var i = 1; i < splitContent.length; i++){
        
            var parenthesesLayers = 0;
            var statementEnd = 0;
        
            for (var j = 0; j < splitContent[i].length; j++){
                var parseChar = splitContent[i][j];
            
                if (parseChar === ')' && parenthesesLayers === 0){
                    statementEnd = j;
                }
                else if (parseChar === ')' && parenthesesLayers !== 0){
                    parenthesesLayers--;
                }
                else if (parseChar === '('){
                    parenthesesLayers++;
                }
            }       
        
            parts.push("@(" + splitContent[i].substr(0, statementEnd) + ")");
            parts.push(splitContent[i].substr(statementEnd + 1));
        }

        return parts;
    };

    var postRenderVariables = function(content, variableDictionary){
        var action = function(part){
            
            if (part.indexOf("@(:") === -1){
                return part;
            }
        
            var endStatement = part.lastIndexOf(")");
            var statement = part.substr(2, endStatement-2).trim();
            var statementParts = statement.split("=");
            var isAssignment = statementParts.length === 2;
            if (isAssignment){
                variableDictionary[statementParts[0].trim()] = eval(statementParts[1]);
                return "";
            }
        
            var varVal = variableDictionary[statementParts[0].trim()];
        
            if (varVal === undefined){
                return "";
            }
        
            return varVal;
        }
   
        return render(parseStatements, action, content);
    };

    var renderVariablesLayout = function(content, variableDictionary){
        var action = function(part){
            if (part.indexOf("@(") === -1){
                return part;
            }
            var endStatement = part.lastIndexOf(")");
            var statement = part.substr(2, endStatement-2).trim();
            var statementParts = statement.split("=");
            var isAssignment = statementParts.length === 2;

            if (isAssignment){
                variableDictionary[statementParts[0].trim()] = eval(statementParts[1]);
                return "";
            }
        
            if (statement.indexOf(":") === 0){
                return part;
            }
       
            var varVal = variableDictionary[statementParts[0].trim()];
        
            if (varVal === undefined){
                return "";
            }
        
            return varVal;
        }
   
        return render(parseStatements, action, content);
    };

    var renderInsertLayout = function(content, layoutContent, variableDictionary){
        var layoutFile = layoutContent.toString();
        var yieldStatement = "@(yield)";
    
        var parse = function(){
            var yieldLocation = layoutFile.split(yieldStatement);
            var parts = [];
            for(var i = 0; i < yieldLocation.length; i++){
                parts.push(yieldLocation[i]);
                if(i !== yieldLocation.length -1){
                    parts.push(yieldStatement);
                }  
            }
        
            return parts;
        };
    
        var action = function(data){
            if(data.trim() === yieldStatement){
                return content;
            } 
       
            return data;
        };
    
        return render(parse, action);
    };

    var render = function(parse, action, content){
        var parsedData = parse(content);
        var renderedData = "";
        for (var i = 0; i < parsedData.length; i++){
            renderedData += action(parsedData[i]);
        }
        return renderedData;
    };

    module.exports.ryanParser = {
            render : function(content, layoutContent){
                var variableDictionary = {};
                var renderedContent = renderInsertLayout(content, layoutContent, variableDictionary);
                renderedContent = renderVariablesLayout(renderedContent, variableDictionary);
                renderedContent = postRenderVariables(renderedContent, variableDictionary);

                return renderedContent;
            }
    };
}());
