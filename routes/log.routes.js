const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// import { v4 as uuidv4 } from 'uuid';


let data = fs.readFileSync(path.join(__dirname + "/DB/tabloDB.json"));

let DB = JSON.parse(data);

router.get('/', function (req, res) {
    try {
        res.send(DB.gameLog)
    } catch (e) {
        console.log(e)
    }

});

router.post('/', cors(), function (req, res) {
    try {
        let newLog = req.body;
        DB.gameLog.push(newLog);
        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + "/DB/tabloDB.json"), json, 'utf8');

        res.send({resultCode: 0})
    } catch (e) {
        console.log(e)
    }

});

router.options('/', cors());


module.exports = router;
