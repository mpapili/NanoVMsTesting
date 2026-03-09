const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from the Unikernel!\n');
}).listen(8083, "0.0.0.0");

console.log('Server running at http://127.0.0.1:8083/');
