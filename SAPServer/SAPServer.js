const HTTP = require('http');

const PORT = 8081;



const SAPServer = HTTP.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    switch (req.url) {
        case '/conn': break;
        default: break;
    }

    res.end();
});

SAPServer.listen(PORT, () => {
    console.log(`SAPServer listening @ http://localhost:${PORT}`);
});