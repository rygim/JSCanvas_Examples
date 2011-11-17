var sys = require("util"),  
http = require("http"),  
url = require("url"),  
path = require("path"),  
fs = require("fs"),
parser = require("./ryanParser.js").ryanParser;  

(function() {
    var respondWithNotFound = function(response, message){
        respondWithCode(response, 404, message);
    };

    var respondWithError = function(response, message){
        respondWithCode(response, 500, message);
    };

    var respondWithCode = function(response, code, message){
        response.writeHead(code, {
            "Content-Type": "text/html"
        });  
            
        var output = "<h2>" + code + "</h2>";
     
        if (message !== undefined){
            output += "<p>" + message + "</p>";
        }
            
        response.end(output);     
    };

    var serveFileContent = function(response, content, contentType){
        response.writeHead(200, {
            "Content-Type" :  contentType
        });  
    
        response.end(content);   
    };

    var serveFile = function(response, filename, content, contentType){
        var layoutPath = path.join(process.cwd(), "/layout.html");
    
        if (contentType !== "text/html"){
            serveFileContent(response, content, contentType);
            return;
        }
    
        path.exists(layoutPath, function(exists){
            if(!exists){
                serveFileContent(response, content, contentType);
                return;
            }
            fs.readFile(layoutPath, function(err, layoutContent){
                var insertedLayoutContent = parser.render(content, layoutContent);
                serveFileContent(response, insertedLayoutContent, contentType);
            });
        });
    };

    var createFilePath = function(urlPath){
        var filePath = path.join(process.cwd(), urlPath);
        var endsWithSlash = filePath.lastIndexOf("/") === filePath.length - 1;
    
        if (filePath.indexOf(".") === -1 && !endsWithSlash){
            filePath += "/";
        }
    
        if (endsWithSlash){
            filePath += "index.html";
        }
    
        return filePath;
    };

    var findContentType = function(file){
        if (file.lastIndexOf(".html") === file.length - 5){
            return "text/html";
        }
    
        if (file.lastIndexOf(".js") === file.length - 3){
            return "text/javascript";
        }
    
        if (file.lastIndexOf(".png") === file.length - 4){
            return "application/png";
        }
        
        if (file.lastIndexOf(".css") == file.length - 4){
            return "text/css";
        }
    
        return "text/html"
    }; 

    module.exports.ryanServer = http.createServer(function(request, response) {  
        var requestedUrl = url.parse(request.url).pathname
        var filenameFromPath = createFilePath(requestedUrl);
    
        path.exists(filenameFromPath, function(exists) {  
            if(!exists) {  
                respondWithNotFound(response, "unable to find file " + filenameFromPath);
                return;  
            }  
        
            fs.readFile(filenameFromPath, function(err, content) {  
                if(err) {  
                    respondWithError(response, "error reading file " + filenameFromPath);
                    return;  
                }  
            
                var contentType = findContentType(filenameFromPath);
                serveFile(response, filenameFromPath, content, contentType);
            });  
        });  
    });
}());