var s = require('node-static');
var app  = require('electron').remote.app
let userDir = app.getPath('userData')
var file = new s.Server(`${userDir}`)

// var file = new s.Server(`${__dirname}/public`)

console.log(userDir)

  export default function spinUp(port) {
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response)
        }).resume()
    }).listen(port)
    }
   

