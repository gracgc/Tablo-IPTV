const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');


router.get('/:gameNumber', function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        if (!data) {
            res.send({resultCode: 10});
            console.log('Game is not exist')
        }
        if (!gameNumber) {
            res.send({resultCode: 10});
            console.log('Incorrect address')
        } else {
            DB.gameInfo.resultCode = 0;
            res.send(DB.gameInfo)
        }


    } catch (e) {
        console.log(e)
    }
});

router.post('/', cors(), function (req, res) {
    try {

        let gameName = req.body.gameName;
        let gameNumber = req.body.gameNumber;
        let gameType = req.body.gameType;

        let newGame = {
            gameInfo: {
                gameName: gameName,
                gameNumber: gameNumber,
                gameType: gameType,
                gameStatus: "Not going",
                gameTime: 0
            },
            gameLog: [],
            teams: [],
            _id: uuidv4()
        };

        if (!gameName || !gameNumber || !gameType) {
            res.send({resultCode: 10});
            console.log('Not enought data')
        } else {
            let json = JSON.stringify(newGame);

            fs.writeFileSync(path.join(__dirname +
                `/DB/game_${newGame.gameInfo.gameNumber}.json`), json, 'utf8');

            res.send({resultCode: 0})
        }

    } catch (e) {
        console.log(e)
    }
});



router.options('/', cors());


module.exports = router;
