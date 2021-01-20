const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');


router.get('/', function (req, res) {
    try {

        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);

        res.send(DB.videos)

    } catch (e) {
        console.log(e)
    }
});

router.get('/current', function (req, res) {
    try {

        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);

        res.send(DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});

router.put('/current', function (req, res) {
    try {

        let currentVideo = req.body.currentVideo

        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);

        DB.currentVideo = currentVideo

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/videos.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.emit('getCurrentVideo', DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});



router.options('/', cors());


module.exports = router;