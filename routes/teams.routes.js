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
            DB.teams.resultCode = 0;
            res.send(DB.teams)
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

        let homeName = req.body.homeName;
        let homeGamers = req.body.homeGamers;
        let guestsName = req.body.guestsName;
        let guestsGamers = req.body.guestsGamers;

        let newTeams = [
            {
                "name": homeName,
                "counter": 0,
                "teamType": "home",
                "timeOut": 0,
                "gamers": homeGamers
            },
            {
                "name": guestsName,
                "counter": 0,
                "teamType": "guests",
                "timeOut": 0,
                "gamers": guestsGamers
            }
        ];


        if (!homeName || !homeGamers || !guestsName || !guestsGamers) {
            res.send({resultCode: 10});
            console.log('Not enought data')
        } else {
            DB.teams = newTeams;

            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname +
                `/DB/game_${gameNumber}.json`), json, 'utf8');

            res.send({resultCode: 0})
        }

    } catch (e) {
        console.log(e)
    }
});

router.put('/gamerGoal/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;
        let symbol = req.body.symbol;

        if (!gameNumber && !teamType && !id && !symbol) {
            res.send({resultCode: 10});
            console.log('Not enought data');
        } else {
            const gamer = DB.teams.find((team) => team.teamType === teamType)
                .gamers.find((g) => g.id === id);
            if (symbol === '+') {
                gamer.goals = gamer.goals + 1;
            }
            if (symbol === '-') {
                if (gamer.goals > 0) {
                    gamer.goals = gamer.goals - 1;
                } else {
                    return
                }
            }


            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname +
                `/DB/game_${gameNumber}.json`), json, 'utf8');

            res.send({resultCode: 0})
        }

    } catch (e) {
        console.log(e)
    }
});

router.put('/teamGoal/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let symbol = req.body.symbol;


        if (!gameNumber && !teamType && !symbol) {
            res.send({resultCode: 10});
            console.log('Not enought data');
        } else {
            const team = DB.teams.find((team) => team.teamType === teamType);
            if (symbol === '+') {
                team.counter = team.counter + 1;
            }
            if (symbol === '-') {
                if (team.counter > 0) {
                    team.counter = team.counter - 1;
                } else {
                    return
                }
            }
        }


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.put('/gamerStatus/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;
        let gamerStatus = req.body.gamerStatus;


        if (!gameNumber && !teamType && !id) {
            res.send({resultCode: 10});
            console.log('Not enought data');
        } else {
            const gamer = DB.teams.find((team) => team.teamType === teamType)
                .gamers.find((g) => g.id === id);
            if (gamerStatus === "in game") {
                gamer.status = "deleted";
            }
            if (gamerStatus === "deleted") {
                gamer.status = "in game";
            }


            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname +
                `/DB/game_${gameNumber}.json`), json, 'utf8');

            res.send(DB)
        }

    } catch (e) {
        console.log(e)
    }
});

router.put('/onField/:gameNumber', cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;
        let onField = req.body.onField;


        if (!gameNumber && !teamType && !id) {
            res.send({resultCode: 10});
            console.log('Not enought data');
        } else {
            const gamer = DB.teams.find((team) => team.teamType === teamType)
                .gamers.find((g) => g.id === id);
            gamer.onField = onField !== true;


            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname +
                `/DB/game_${gameNumber}.json`), json, 'utf8');

            res.send(DB)
        }

    } catch (e) {
        console.log(e)
    }
});


router.options('/', cors());


module.exports = router;
