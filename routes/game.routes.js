const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const authMW = require('../middleware/authMW')


router.get('/:gameNumber', function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        if (!data) {
            res.send({resultCode: 10});
            console.log('Game is not exist')
        }

        DB.gameInfo.resultCode = 0;
        res.send(DB.gameInfo)


    } catch (e) {
        console.log(e)
    }
});

router.post('/', authMW, cors(), function (req, res) {
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
                    timeData: {timeMem: 0, timeDif: 0, timeMemTimer: 1200000, deadLine: 1200000},
                    isRunning: false,
                    runningTime: 0,
                    timeoutData: {
                        timeData: {timeMem: 0, timeDif: 0, timeMemTimer: 30000, deadLine: 30000},
                        isRunning: false,
                        runningTime: 0
                    },
                    period: 1,
                    smallOvertime: 0,
                    bigOvertime: 0
                }
            },
            logData: {
                gameLog: [],
                tabloLog: {
                    tempLog: [
                        {
                            item: ""
                        }
                    ],
                    consLog: []
                }
            },
            teams: []
        };


        let newGameJson = JSON.stringify(newGame);
        let newSaveJson = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${newGame.gameInfo.gameNumber}.json`), newGameJson, 'utf8');

        fs.writeFileSync(path.join(__dirname +
            `/DB/saved_games.json`), newSaveJson, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getGame${gameNumber}`, DB.gameInfo)

    } catch
        (e) {
        console.log(e)
    }
})

router.put('/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);


        let period = req.body.period;
        let time = req.body.time;
        let homeName = req.body.homeName;
        let homeGamers = req.body.homeGamers;
        let guestsName = req.body.guestsName;
        let guestsGamers = req.body.guestsGamers;


        DB.gameInfo.gameTime.period = period
        DB.gameInfo.gameTime.smallOvertime = 0
        DB.gameInfo.gameTime.bigOvertime = 0
        DB.gameInfo.gameTime.timeData.deadLine = 1200000
        DB.gameInfo.gameTime.timeData.timeMemTimer = time
        DB.gameInfo.gameTime.timeData.timeDif = 1200000 - time
        DB.gameInfo.gameTime.timeData.timeMem = 1200000 - time
        DB.teams.find(t => t.teamType === 'home').name = homeName
        DB.teams.find(t => t.teamType === 'guests').name = guestsName

        homeGamers.map(g => {
            DB.teams.find(t => t.teamType === 'home').gamers.find(gamer => gamer.id === g.id).fullName = g.fullName
            DB.teams.find(t => t.teamType === 'home').gamers.find(gamer => gamer.id === g.id).gamerNumber = g.gamerNumber
        })

        guestsGamers.map(g => {
            DB.teams.find(t => t.teamType === 'guests').gamers.find(gamer => gamer.id === g.id).fullName = g.fullName
            DB.teams.find(t => t.teamType === 'guests').gamers.find(gamer => gamer.id === g.id).gamerNumber = g.gamerNumber
        })

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getGame${gameNumber}`, DB.gameInfo)

        io.emit(`getTeams${gameNumber}`, DB.teams)

        io.emit(`getTime${gameNumber}`, DB.gameInfo.gameTime)

    } catch
        (e) {
        console.log(e)
    }
})

router.put('/deleteGame/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        fs.unlinkSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`));

        let data = fs.readFileSync(path.join(__dirname, `/DB/saved_games.json`));
        let DB = JSON.parse(data);


        let deletedGame = DB.savedGames.findIndex(g => g.gameNumber === +gameNumber)


        DB.savedGames.splice(deletedGame, 1);

        DB.savedGames.forEach(function(item, i, arr) {
            if (i >= deletedGame) {
                fs.renameSync(path.join(__dirname + `/DB/game_${arr[i].gameNumber}.json`)
                    , path.join(__dirname + `/DB/game_${arr[i].gameNumber - 1}.json`));
                arr[i].gameNumber -= 1
                // console.log(arr[i].gameNumber)
            }
        });



        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/saved_games.json`), json, 'utf8');

        res.send({resultCode: 0});

    } catch
        (e) {
        console.log(e)
    }
})



router.options('/', cors());


module.exports = router;
