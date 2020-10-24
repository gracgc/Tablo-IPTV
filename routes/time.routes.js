const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');


router.get('/', function (req, res) {
    try {

        let timeDB = {
            time: Date.now()
        };

        let json = JSON.stringify(timeDB);

        fs.writeFileSync(path.join(__dirname + `/DB/time.json`), json, 'utf8');


        let data = fs.readFileSync(path.join(__dirname + `/DB/time.json`));
        let DB = JSON.parse(data);

        DB.resultCode = 0;
        res.send(DB)
    } catch (e) {
        console.log(e)
    }

});


router.options('/', cors());


module.exports = router;
