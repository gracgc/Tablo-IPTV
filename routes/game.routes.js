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

        let data = fs.readFileSync(path.join(__dirname + `/DB/saved_games.json`));
        let DB = JSON.parse(data);

        let gameName = req.body.gameName;
        let gameNumber = req.body.gameNumber;
        let gameType = req.body.gameType;

        let newSave = {
            gameName: gameName,
            gameNumber: gameNumber,
            gameType: gameType
        };

        DB.savedGames.push(newSave);

        let newGame = {
            gameInfo: {
                gameName: gameName,
                gameNumber: gameNumber,
                gameType: gameType,
                gameStatus: "Not going",
                gameTime: {
                    timeData: {timeMem: 0, timeDif: 0, timeMemTimer: 1200000},
                    dif: null,
                    isRunning: false,
                    runningTime: 0
                }
            },
            gameLog: [],
            teams: []
        };


        if (!gameName || !gameNumber || !gameType) {
            res.send({resultCode: 10});
            console.log('Not enought data')
        } else {
            let newGameJson = JSON.stringify(newGame);
            let newSaveJson = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname +
                `/DB/game_${newGame.gameInfo.gameNumber}.json`), newGameJson, 'utf8');

            fs.writeFileSync(path.join(__dirname +
                `/DB/saved_games.json`), newSaveJson, 'utf8');

            res.send({resultCode: 0})
        }

    } catch
        (e) {
        console.log(e)
    }
})
;


router.options('/', cors());


module.exports = router;
