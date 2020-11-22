const bodyParser = require('body-parser');
const path = require('path');

const app = require('express')();

const server = require('http').Server(app)



if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'my-app', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'my-app', 'build', 'index.html'))
    })
}

const PORT = 5000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));



app.use('/api/teams', require('./routes/teams.routes'));
app.use('/api/log', require('./routes/log.routes'));
app.use('/api/game', require('./routes/game.routes'));
app.use('/api/savedGames', require('./routes/savedGames.routes'));
app.use('/api/time', require('./routes/time.routes'));


let logTest = {log: [{log: 'test', date: Date.now()}]}

app.get('/test', (req, res) => {
    res.send(logTest.log)
})




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


const io = require('socket.io')(server)

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('test', log => {
        console.log(log)
        logTest.log.push(log)
        console.log(logTest)
        io.emit('testGet', logTest)
    })
});