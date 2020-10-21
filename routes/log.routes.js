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

        if (!gameNumber) {
            res.send({resultCode: 10});
            console.log('Incorrect address')
        } else {
            DB.gameLog.resultCode = 0;
            res.send(DB.gameLog)
        }
    } catch (e) {
        console.log(e)
    }

});

router.post('/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let newLogItem = req.body.newLogItem;

        let newLog = {
            item: newLogItem
        };

        DB.gameLog.push(newLog);
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

router.options('/', cors());


module.exports = router;
