const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// import { v4 as uuidv4 } from 'uuid';


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



router.options('/', cors());


module.exports = router;
