const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');



router.get('/', function (req, res) {
    try {
        let data = fs.readFileSync(path.join(__dirname + `/DB/saved_games.json`));
        let DB = JSON.parse(data);
        //

        if (!data) {
            res.send({resultCode: 10});
            console.log('Games is not exist')
        } else {
            DB.resultCode = 0;
            res.send(DB)
        }

    } catch (e) {
        console.log(e)
    }
});

router.post('/', cors(), function (req, res) {
    try {
        let data = fs.readFileSync(path.join(__dirname + "/DB/saved_games.json"));

        let DB = JSON.parse(data);

        let gameName = req.body.gameName;
        let gameNumber = req.body.gameNumber;
        let gameType = req.body.gameType;

        let game = {
            gameName: gameName,
            gameNumber: gameNumber,
            gameType: gameType,
            _id: uuidv4()
        };

        DB.savedGames.push(game);

        if (!gameName || !gameNumber || !gameType) {
            res.send({resultCode: 10});
            console.log('Not enought data')
        } else {
            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname +
                `/DB/saved_games.json`), json, 'utf8');

            res.send({resultCode: 0})
        }

    } catch (e) {
        console.log(e)
    }

});

router.options('/', cors());


module.exports = router;
