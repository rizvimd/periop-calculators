const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Set CORS headers for ES modules
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    if (req.url === '/') {
        // Serve the HTML file
        fs.readFile(path.join(__dirname, 'demo.html'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            res.end(data);
        });
    } else {
        // Serve static files (JS modules)
        const filePath = path.join(__dirname, req.url);
        const ext = path.extname(filePath);
        
        // Set proper content type for JS modules
        const contentType = ext === '.js' ? 'application/javascript' : 'text/plain';
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            res.setHeader('Content-Type', contentType);
            res.writeHead(200);
            res.end(data);
        });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Demo server running at http://localhost:${PORT}`);
    console.log('Open your browser to http://localhost:3000 to test the calculators');
});