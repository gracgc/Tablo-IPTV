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

        DB.teams.resultCode = 0;
        res.send(DB.teams)
    } catch (e) {
        console.log(e)
    }
});

router.post('/:gameNumber', authMW, cors(), function (req, res) {
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
                "timeOut": false,
                "gamers": homeGamers
            },
            {
                "name": guestsName,
                "counter": 0,
                "teamType": "guests",
                "timeOut": false,
                "gamers": guestsGamers
            }
        ];


        DB.teams = newTeams;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getTeams${gameNumber}`, DB.teams)

    } catch (e) {
        console.log(e)
    }
});

router.put('/gamerGoal/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;
        let symbol = req.body.symbol;


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

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getTeams${gameNumber}`, DB.teams)


    } catch (e) {
        console.log(e)
    }
});

router.put('/teamGoal/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let symbol = req.body.symbol;


        const team = DB.teams.find((team) => team.teamType === teamType);

        if (symbol === '+') {
            team.counter = team.counter + 1;
        }
        if (symbol === '-' && team.counter > 0) {
            team.counter = team.counter - 1;
        }
        if (team.counter === 0) {
            team.counter = 0
        }


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.emit(`getTeams${gameNumber}`, DB.teams);

    } catch (e) {
        console.log(e)
    }
});

router.put('/gamerStatus/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;


        let gamer = DB.teams.find(team => team.teamType === teamType)
            .gamers.find(g => g.id === id);

        if (gamer.status === 'deleted') {
            gamer.status = 'in game';
        } else {
            gamer.status = 'deleted';
        }

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getTeams${gameNumber}`, DB.teams)


    } catch (e) {
        console.log(e)
    }
});

router.put('/onField/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;
        let onField = req.body.onField;


        const gamer = DB.teams.find((team) => team.teamType === teamType)
            .gamers.find((g) => g.id === id);
        gamer.onField = onField !== true;


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getTeams${gameNumber}`, DB.teams)


    } catch (e) {
        console.log(e)
    }
});

router.put('/penalty/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;
        let timeOfPenalty = req.body.timeOfPenalty;
        let whenWasPenalty = req.body.whenWasPenalty;


        const gamer = DB.teams.find((team) => team.teamType === teamType)
            .gamers.find((g) => g.id === id);
        gamer.timeOfPenalty = timeOfPenalty;
        gamer.whenWasPenalty = whenWasPenalty;


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getTeams${gameNumber}`, DB.teams)

    } catch (e) {
        console.log(e)
    }
});


router.options('/', cors());


module.exports = router;
