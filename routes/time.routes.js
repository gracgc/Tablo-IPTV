const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');


router.get('/:gameNumber', function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        DB.resultCode = 0;
        res.send(DB.gameInfo)
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

router.put('/isRunning/:gameNumber', function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let isRunning = req.body.isRunning;
        let timeDif = req.body.timeDif;
        let timeMem = req.body.timeMem;
        let timeMemTimer = req.body.timeMemTimer;
        let currentLocalTime = req.body.currentLocalTime;
        let period = req.body.period;

        DB.gameInfo.gameTime.isRunning = isRunning;
        if (isRunning === false) {
            DB.gameInfo.gameStatus = "Not going"
        } else {
            DB.gameInfo.gameStatus = "Going"
        }
        DB.gameInfo.gameTime.timeData.timeDif = timeDif;
        DB.gameInfo.gameTime.timeData.timeMem = timeMem;
        DB.gameInfo.gameTime.timeData.timeMemTimer = timeMemTimer;
        DB.gameInfo.gameTime.runningTime = currentLocalTime;
        DB.gameInfo.period = period;
        // DB.runningTime = new Date(2011, 0, 1, 0, 0, 0, 0).getTime() - currentLocalTime;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.put('/dif', function (req, res) {
    try {

        let currentLocalTime = req.body.currentLocalTime;

        let dif = new Date(2011, 0, 1, 0, 0, 0, 0) - currentLocalTime;


        res.send({currentLocalTime: currentLocalTime, dif: dif})

    } catch (e) {
        console.log(e)
    }
});


router.options('/', cors());


module.exports = router;
