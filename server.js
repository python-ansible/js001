var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号\n' +
        '比如：node server.js 8888')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var path = request.url
    var query = ''
    if (path.indexOf('?') >= 0) {
        query = path.substring(path.indexOf('?'))
    }
    var pathNoQuery = parsedUrl.pathname
    var queryObject = parsedUrl.query
    var method = request.method

    console.log('HTTP 路径为\n' + path)

    if (path === '/') {
        var string = fs.readFileSync('./index.html', 'utf-8')
        var amount = fs.readFileSync('./db', 'utf-8')
        string = string.replace('&&&amount&&&', amount)
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.write(string)
        response.end()

    } else if (path === '/style.css') {
        var string = fs.readFileSync('./style.css', 'utf-8')
        response.setHeader('Content-Type', 'text/css; charset=utf-8')
        response.write(string)
        response.end()
    } else if (path === '/main.js') {
        var string = fs.readFileSync('./main.js', 'utf-8')
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
        response.write(string)
        response.end()
    } else if (path === '/pay') {
        var amount = fs.readFileSync('./db', 'utf-8')
        if (Math.random() > 0.5) {
            var newAmount = amount - 1
            console.log(newAmount)
            fs.writeFileSync('./db', newAmount)
            response.setHeader('Content-Type', 'text/javascript')
            response.statusCode = 200
            response.write(`
            amount.innerText -= 1
            `)
        } else {
            response.statusCode = 400
            response.write('failed')
        }
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.write('找不到对应的路径，你需要自行修改 index.js')
        response.end()
    }
    console.log(method + ' ' + request.url)
})

server.listen(port)
console.log("监听" + port + "成功打开 http://localhost:" + port)
