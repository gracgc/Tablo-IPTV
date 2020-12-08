const {Router} = require('express');
const router = Router();
const cors = require('cors');
const fs = require('fs');
const path = require('path');



router.get('/', cors(), async function (req, res) {
    try {
        let data = fs.readFileSync(path.join(__dirname + `/DB/devices.json`));
        let DB = JSON.parse(data);

        res.send(DB.devices)

    } catch (e) {
        console.log(e)
    }
});



router.options('/', cors());


module.exports = router;