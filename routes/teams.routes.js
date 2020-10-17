const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');

// import { v4 as uuidv4 } from 'uuid';
let data = fs.readFileSync(path.join(__dirname + "/DB/tabloDB.json"));

let DB = JSON.parse(data);


router.get('/', function (req, res) {
    try {
        res.send(DB.teams)
    } catch (e) {
        console.log(e)
    }
});


module.exports = router;
