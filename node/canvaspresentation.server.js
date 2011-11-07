var ryanServer = require("./ryanServer.js").ryanServer;  

var port = 7777;

try {
    ryanServer.listen(port);  
}
catch(err) {
    console.log("Error creating server");
    console.log(err);
}

console.log("Listening at port " + port);
