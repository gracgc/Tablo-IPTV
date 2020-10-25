const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');


router.get('/', function (req, res) {
    try {

        let timeDB = {
            timeData: {
                time: Date.now(),
                timeDif: 0
            }
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

router.put('/', function (req, res) {
    try {

        let data = fs.readFileSync(path.join(__dirname + `/DB/time.json`));
        let DB = JSON.parse(data);

        let timeDif = req.body.timeDif;

        DB.timeData.timeDif = timeDif;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/time.json`), json, 'utf8');


        if (!timeDif) {
            res.send({resultCode: 10});
            console.log('Not enought data')
        } else {
            res.send({resultCode: 0})
        }
    } catch (e) {
        console.log(e)
    }

});


router.options('/', cors());


module.exports = router;
