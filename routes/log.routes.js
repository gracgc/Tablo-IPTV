const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');


router.get('/:gameNumber', function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        res.send(DB.logData)

    } catch (e) {
        console.log(e)
    }
});

router.post('/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let newLogItem = req.body.newLogItem;

        let newLogFirst = {
            item: newLogItem,
            id: 1
        };

        let newLog = {
            item: newLogItem,
            id: DB.logData.gameLog.length === 0 ? 0 : DB.logData.gameLog[DB.logData.gameLog.length - 1].id + 1
        };


        if (DB.logData.gameLog.length === 0) {
            DB.logData.gameLog.push(newLogFirst)
        } else {
            // if (newLogItem !== DB.logData.gameLog[DB.logData.gameLog.length - 1].item) {
                DB.logData.gameLog.push(newLog);
            // } else return
        }


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`), json, 'utf8');


        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.emit('getLog', DB.logData)

    } catch (e) {
        console.log(e)
    }
});

router.put('/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let deletedItem = req.body.deletedItem;

        DB.logData.gameLog.splice(deletedItem, 1);


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})


        const io = req.app.locals.io;

        io.emit('getLog', DB.logData)

    } catch (e) {
        console.log(e)
    }
});

router.post('/temp/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let newLogItem = req.body.newLogItem;

        let newLog = {
            item: newLogItem
        };

        DB.logData.tabloLog.tempLog.push(newLog);

        const io = req.app.locals.io;

        io.emit('getLog', DB.logData)

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`), json, 'utf8');

        if (!gameNumber) {
            res.send({resultCode: 10});
            console.log('Incorrect address')
        } else {
            res.send({resultCode: 0})
        }

    } catch (e) {
        console.log(e)
    }
});

router.post('/cons/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let gamerId = req.body.gamerId;
        let teamType = req.body.teamType;
        let newLogItem = req.body.newLogItem;

        let newLog = {
            id: gamerId,
            teamType: teamType,
            item: newLogItem
        };

        DB.logData.tabloLog.consLog.push(newLog);

        const io = req.app.locals.io;

        io.emit('getLog', DB.logData)

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`), json, 'utf8');

        if (!gameNumber) {
            res.send({resultCode: 10});
            console.log('Incorrect address')
        } else {
            res.send({resultCode: 0})
        }

    } catch (e) {
        console.log(e)
    }
});

router.put('/cons/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let deletedItem = req.body.deletedItem;

        DB.logData.tabloLog.consLog.splice(deletedItem, 1);

        const io = req.app.locals.io;

        io.emit('getLog', DB.logData)

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})


    } catch (e) {
        console.log(e)
    }
});

router.options('/', cors());


module.exports = router;
