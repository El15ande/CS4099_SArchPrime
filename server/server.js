/*
    School server - terminate:
        Kill PORT process:
            lsof -i :20804
            kill -9 <PID>
        Kill tmux process:
            tmux list-sessions
            tmux kill-session -t <sessionid>
    
    School server - start:
        Attach server process to tmux:
            tmux
            node server.js
            C^b + d
        Reload nginx conf:
            nginx -c /host/yw69/nginx.conf -t
            nginx -c /host/yw69/nginx.conf -s reload
*/
const Express = require('express');
const BodyParser = require('body-parser');
const Cors = require('cors');
const FS = require('fs');

const APP = Express();
const PORT = 20804;

APP.use(BodyParser.urlencoded({ extended: false }));
APP.use(BodyParser.json());
APP.use(Cors());

const archDataPrototype = {
    name: '',
    indices: [],
    connections: []
};

// yw69.host.cs.st-andrews.ac.uk/node
APP.get('/', function(req, res) {
    console.log(`GET /`);

    res.send('Welcome to my server!');
});

// yw69.host.cs.st-andrews.ac.uk/nodearchlist
// GET Archlist.json;
APP.get('/archlist', (req, res) => {
    console.log(`GET /archlist`);

    FS.readFile('ArchList.json', function(err, data) {
        if(err) res.send({ err });

        res.send(JSON.parse(data));
    });
});

// yw69.host.cs.st-andrews.ac.uk/nodearch
// GET {title}.json;
APP.get('/arch/:title', (req, res) => {
    let jsonFile = `${req.params.title}.json`;

    console.log(`GET /arch ${jsonFile}`);

    FS.readFile(`Archs/${jsonFile}`, function(err, data) {
        if(err) res.send({ err });

        res.send(JSON.parse(data));
    });
});

// yw69.host.cs-st-andrews.ac.uk/nodearch
// POST(update) {title}.json;
APP.post('/arch/:title', (req, res) => {
    let jsonFile = `${req.params.title}.json`;
    let jsonData = req.body;

    console.log(`POST /arch ${jsonFile}`);

    FS.writeFileSync(`Archs/${jsonFile}`, JSON.stringify(jsonData));

    res.end();
});

// yw69.host.cs.st-andrews.ac.uk/nodearch
// PUT(create) {title}.json;
APP.put('/arch/:title', (req, res) => {
    let newTitle = req.params.title;
    let jsonFile = `${newTitle}.json`;

    console.log(`PUT /arch ${jsonFile}`);

    FS.readFile('ArchList.json', function(err, data) {
        if(err) res.send({ err });

        let archListJson = JSON.parse(data);
        let newArchListLink = {
            title: newTitle,
            icon: 'mdi-home-analytics'
        }
        archListJson.push(newArchListLink);

        let archData = Object.assign({}, archDataPrototype);
        archData.name = newTitle;

        FS.writeFileSync('ArchList.json', JSON.stringify(archListJson));
        FS.writeFileSync(`Archs/${jsonFile}`, JSON.stringify(archData));
    });

    res.end();
});

// yw69.host.cs.st-andrews.ac.uk/nodearch
// DELETE {title}.json;
APP.delete('/arch/:title', (req, res) => {
    let deletedTitle = req.params.title;
    let jsonFile = `${deletedTitle}.json`;

    console.log(`DELETE /arch ${jsonFile}`);

    FS.readFile('ArchList.json', function(err, data) {
        if(err) res.send({ err });

        let archListJson = JSON.parse(data);
        archListJson = archListJson.filter(function(arch) {
            return arch.title !== deletedTitle;
        });

        FS.writeFileSync('ArchList.json', JSON.stringify(archListJson));
        FS.unlinkSync(`Archs/${jsonFile}`);
    });

    res.end();
});

APP.listen(PORT, () => {
    FS.open('ArchList.json', (err) => {
        if(err) {
            FS.writeFileSync('ArchList.json', JSON.stringify([]));
            FS.mkdirSync('./Archs');
        }
    });

    console.log(`Server listening on localhost:${PORT}`);
});