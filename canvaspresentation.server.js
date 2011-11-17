var ryanServer = require("./ryanServer.js").ryanServer;  

var ip = process.argv[2] || "192.168.92.130",
    port = +process.argv[3] || 7777;

try {
    ryanServer.listen(port, ip);  
}
catch(err) {
    console.log("Error creating server");
    console.log(err);
}
