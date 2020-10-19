const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');

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


module.exports = router;
