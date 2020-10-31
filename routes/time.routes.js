const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');


router.get('/', function (req, res) {
    try {
        let data = fs.readFileSync(path.join(__dirname + `/DB/time.json`));
        let DB = JSON.parse(data);

        DB.resultCode = 0;
        res.send(DB)
    } catch (e) {
        console.log(e)
    }
});

router.put('/', function (req, res) {
    try {

        let data = fs.readFileSync(path.join(__dirname + `/DB/time.json`));
        let DB = JSON.parse(data);

        let timeDif = req.body.timeDif;
        let timeMem = req.body.timeMem;
        let timeMemTimer = req.body.timeMemTimer;

        DB.timeData.timeDif = timeDif;
        DB.timeData.timeMem = timeMem;
        DB.timeData.timeMemTimer = timeMemTimer;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/time.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.put('/isRunning', function (req, res) {
    try {

        let data = fs.readFileSync(path.join(__dirname + `/DB/time.json`));
        let DB = JSON.parse(data);

        let isRunnung = req.body.isRunning;
        let timeDif = req.body.timeDif;
        let timeMem = req.body.timeMem;
        let timeMemTimer = req.body.timeMemTimer;

        DB.isRunning = isRunnung;
        DB.timeData.timeDif = timeDif;
        DB.timeData.timeMem = timeMem;
        DB.timeData.timeMemTimer = timeMemTimer;
        DB.runningTime = Date.now();

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/time.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.post('/dif', function (req, res) {
    try {

        let currentTime = req.body.currentTime;

        let dif = Date.now() - currentTime;

        res.send({dif: dif})

    } catch (e) {
        console.log(e)
    }
});


router.options('/', cors());


module.exports = router;
