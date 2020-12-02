const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');


router.get('/', function (req, res) {
    try {

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_number.json`));
        let DB = JSON.parse(data);

        DB.resultCode = 0;
        res.send(DB)


    } catch (e) {
        console.log(e)
    }
});

router.put('/', function (req, res) {
    try {

        let gameNumber = req.body.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_number.json`));
        let DB = JSON.parse(data);

        DB.gameNumber = gameNumber;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/game_number.json`), json, 'utf8');


        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit('getGameNumber', DB.gameNumber)


    } catch (e) {
        console.log(e)
    }
});

router.options('/', cors());

module.exports = router;