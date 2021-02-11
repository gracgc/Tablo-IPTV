const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const authMW = require('../middleware/authMW')
const config = require('config')
let url = `${config.get('baseUrl')}:${config.get('port')}`


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

        let date = new Date;

        let newSave = {
            gameName: gameName,
            gameNumber: gameNumber,
            gameType: gameType,
            dateOfCreation:
                `${date.getDate() < 10 && '0'}${date.getDate()}.${date.getMonth() < 10 && '0'}${date.getMonth()+1}.${date.getFullYear()}
                UTC${(-date.getTimezoneOffset() / 60) < 0 ? '-' : '+'}${-date.getTimezoneOffset() / 60}`
        };

        DB.savedGames.push(newSave);


        let newGame = {
            gameInfo: {
                gameName: gameName,
                gameNumber: gameNumber,
                gameType: gameType,
                gameStatus: "Not going",
                preset: 1,
                gameTime: {
                    timeData: {timeMem: 0, timeDif: 0, timeMemTimer: 1200000, deadLine: 1200000},
                    isRunning: false,
                    runningTime: 0,
                    timeoutData: {
                        timeData: {timeMem: 0, timeDif: 0, timeMemTimer: 0, deadLine: 0},
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


        let newVideo = {
            currentVideo: {
                n: 0,
                padding: true
            },
            timeData: {
                timeMem: 0,
                timeDif: 0,
                isRunning: false,
                runningTime: 0
            },
            videos: []
        }


        let newGameJson = JSON.stringify(newGame);
        let newSaveJson = JSON.stringify(DB);
        let newVideoJson = JSON.stringify(newVideo);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${newGame.gameInfo.gameNumber}.json`), newGameJson, 'utf8');

        fs.writeFileSync(path.join(__dirname +
            `/DB/saved_games.json`), newSaveJson, 'utf8');

        fs.writeFileSync(path.join(__dirname +
            `/DB/video_${newGame.gameInfo.gameNumber}.json`), newVideoJson, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getSavedGames`, DB.savedGames)

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
        let additionalHomeGamers = req.body.additionalHomeGamers;
        let additionalGuestsGamers = req.body.additionalGuestsGamers;

        if (time > 1200000) {
            time = 1200000
        }


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

        DB.teams.find(t => t.teamType === 'home').gamers = DB.teams.find(t => t.teamType === 'home').gamers.concat(additionalHomeGamers)

        DB.teams.find(t => t.teamType === 'guests').gamers = DB.teams.find(t => t.teamType === 'guests').gamers.concat(additionalGuestsGamers)

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getGame${gameNumber}`, DB.gameInfo)

        DB.teams.find(t => t.teamType === 'home').logo = `${url}/api/teams/homeLogo/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').logo = `${url}/api/teams/guestsLogo/${gameNumber}/${Date.now()}`;

        io.emit(`getTeams${gameNumber}`, DB.teams)

        io.emit(`getTime${gameNumber}`, DB.gameInfo.gameTime)

    } catch
        (e) {
        console.log(e)
    }
})

router.put('/reset/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);



        DB.gameInfo.gameStatus = "Not going"
        DB.gameInfo.gameTime = {
            timeData: {
                timeMem: 0,
                timeDif: 0,
                timeMemTimer: 1200000,
                deadLine: 1200000
            },
            isRunning: false,
            runningTime: 0,
            timeoutData: {
                timeData: {
                    timeMem: 0,
                    timeDif: 0,
                    timeMemTimer: 0,
                    deadLine: 0
                },
                isRunning: false,
                runningTime: 0
            },
            period: 1,
            smallOvertime: 0,
            bigOvertime: 0
        }


        DB.logData = {
            gameLog: [],
            tabloLog: {
                tempLog: [
                    {
                        item: ""
                    }
                ],
                consLog: []
            }
        }


        DB.teams.forEach(value => {
            value.counter = 0
        })


        DB.teams.find(t => t.teamType === 'home').gamers.forEach(value => {
            value.onField = value.id <= 6;
            value.status = 'in game'
            value.goals = 0
            value.timeOfPenalty = 0
            value.whenWasPenalty = 0
        })

        DB.teams.find(t => t.teamType === 'guests').gamers.forEach(value => {
            value.onField = value.id <= 6;
            value.status = 'in game'
            value.goals = 0
            value.timeOfPenalty = 0
            value.whenWasPenalty = 0
        })


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getGame${gameNumber}`, DB.gameInfo)

        DB.teams.find(t => t.teamType === 'home').logo = `${url}/api/teams/homeLogo/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').logo = `${url}/api/teams/guestsLogo/${gameNumber}/${Date.now()}`;

        io.emit(`getTeams${gameNumber}`, DB.teams)

        io.emit(`getTime${gameNumber}`, DB.gameInfo.gameTime)

        io.emit(`getLog${gameNumber}`, DB.logData)

    } catch
        (e) {
        console.log(e)
    }
})


router.options('/', cors());


module.exports = router;
