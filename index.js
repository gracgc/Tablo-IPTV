const bodyParser = require('body-parser');
const path = require('path');
const config = require('config');
const express = require('express');
const fs = require('fs');
const uploadFile = require('express-fileupload')


const app = express();

const server = require('http').Server(app);


const io = require('socket.io')(server);


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(uploadFile())

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('addDevice', res => {
        let data = fs.readFileSync(path.join(__dirname + `/routes/DB/devices.json`));
        let DB = JSON.parse(data);


        if (res.isAuth === false) {
            if (res.pathname.indexOf('tabloClient') !== -1) {
                DB.devices.push({id: socket.id, type: 'Main Tablo'})
            } else {
                DB.devices.push({id: socket.id, type: 'undefined'})
            }
        } else {
            if (DB.devices.findIndex(user => user.id === socket.id) !== -1) {
                DB.devices[DB.devices.findIndex(user => user.id === socket.id)].type = 'Admin'
            } else {
                DB.devices.push({id: socket.id, type: 'Admin'})
            }
        }

        io.emit('getDevices', DB.devices)


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/routes/DB/devices.json`), json, 'utf8');
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');

        let data = fs.readFileSync(path.join(__dirname + `/routes/DB/devices.json`));
        let DB = JSON.parse(data);

        let deletedItem = DB.devices.findIndex(user => user.id === socket.id);

        DB.devices.splice(deletedItem, 1)

        io.emit('getDevices', DB.devices)

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/routes/DB/devices.json`), json, 'utf8');
    });

    socket.on('setGameNumberStart', res => {

        let data = fs.readFileSync(path.join(__dirname + `/routes/DB/game_number.json`));
        let DB = JSON.parse(data);

        io.emit('getGameNumberStart', DB.gameNumber)
    })
});


app.locals.io = io;


app.use('/api/teams', require('./routes/teams.routes'));
app.use('/api/log', require('./routes/log.routes'));
app.use('/api/game', require('./routes/game.routes'));
app.use('/api/savedGames', require('./routes/savedGames.routes'));
app.use('/api/time', require('./routes/time.routes'));
app.use('/api/gameNumber', require('./routes/gameNumber.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/devices', require('./routes/devices.routes'));
app.use('/api/videosMP4', require('./routes/videos.routes'));


if (process.env.NODE_ENV === 'production') {

    app.use('/', express.static(path.join(__dirname, 'my-app', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'my-app', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

const start = () => {
    try {
        server.listen(PORT, () => {
            console.log(`Server has been started on ${PORT}...`)
        })
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1)
    }
};

start();