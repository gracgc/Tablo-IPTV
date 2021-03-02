const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const authMW = require('../middleware/authMW');


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

router.post('/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let newLogItem = req.body.newLogItem;

        if (DB.logData.gameLog.length === 0) {

            DB.logData.gameLog.push(
                {
                    item: newLogItem,
                    id: 1
                }
            )
        } else {
            if (newLogItem === DB.logData.gameLog[DB.logData.gameLog.length - 1].item && DB.logData.gameLog[DB.logData.gameLog.length - 1].item.indexOf('Конец') !== -1) {

            } else {

                DB.logData.gameLog.push(
                    {
                        item: newLogItem,
                        id: DB.logData.gameLog[DB.logData.gameLog.length - 1].id + 1
                    }
                );
            }
        }

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})


        const io = req.app.locals.io;

        io.emit(`getLog${gameNumber}`, DB.logData)

    } catch (e) {
        console.log(e)
    }
});

router.put('/:gameNumber', authMW, cors(), function (req, res) {
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

        io.emit(`getLog${gameNumber}`, DB.logData)

    } catch (e) {
        console.log(e)
    }
});

router.post('/temp/:gameNumber', authMW, cors(), function (req, res) {
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

        io.emit(`getLog${gameNumber}`, DB.logData);

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.post('/cons/:gameNumber', authMW, cors(), function (req, res) {
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

        io.emit(`getLog${gameNumber}`, DB.logData);

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.put('/cons/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let deletedItem = req.body.deletedItem;

        DB.logData.tabloLog.consLog.splice(deletedItem, 1);

        const io = req.app.locals.io;

        io.emit(`getLog${gameNumber}`, DB.logData);

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.options('/', cors());


module.exports = router;