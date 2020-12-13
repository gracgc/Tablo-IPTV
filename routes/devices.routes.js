const {Router} = require('express');
const router = Router();
const cors = require('cors');
const fs = require('fs');
const path = require('path');


router.get('/', cors(), function (req, res) {
    try {
        let data = fs.readFileSync(path.join(__dirname + `/DB/devices.json`));
        let DB = JSON.parse(data);

        res.send(DB.devices)

    } catch (e) {
        console.log(e)
    }
});

router.put('/', cors(), function (req, res) {
    try {
        let data = fs.readFileSync(path.join(__dirname + `/DB/devices.json`));
        let DB = JSON.parse(data);

        let deviceType = req.body.deviceType;
        let deviceId = req.body.deviceId;

        let device = DB.devices.find(device => device.id === deviceId)

        device.type = deviceType

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/devices.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.emit('getDevices', DB.devices)
        io.emit(`setDevicePage${deviceId}`, deviceType)

    } catch (e) {
        console.log(e)
    }
});


router.options('/', cors());


module.exports = router;