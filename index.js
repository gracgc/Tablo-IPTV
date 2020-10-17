const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

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


const start = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server has been started on ${PORT}...`)
        })
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1)
    }
};

start();
