const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const authMW = require('../middleware/authMW');
const {getVideoDurationInSeconds} = require('get-video-duration');
const config = require('config')

let url = `${config.get('baseUrl')}:${config.get('port')}`


router.get('/', function (req, res) {
    try {

        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);


        res.send(DB.videos)


    } catch (e) {
        console.log(e)
    }
});

router.get('/editor/:gameNumber', function (req, res) {
    try {

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);


        res.send(DB.videos)


    } catch (e) {
        console.log(e)
    }
});

router.put('editor/current:gameNumber', authMW, function (req, res) {
    try {

        let gameNumber = req.params.gameNumber;

        let currentVideo = req.body.currentVideo;

        let data = fs.readFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);

        DB.currentVideo = currentVideo;


        if (DB.currentVideo.n) {
            DB.currentVideo.n += 1
        } else {
            DB.currentVideo.n = 1
        }

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit('getCurrentVideoEditor', DB.currentVideo)

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

router.get('/mp4/:videoNumber/:dateNow', function (req, res) {
    try {

        let videoNumber = req.params.videoNumber;

        let video = path.join(__dirname + `/DB/videosMP4/video_${videoNumber}.mp4`);

        res.sendFile(video);

    } catch (e) {
        console.log(e)
    }
});


router.put('/current', authMW, function (req, res) {
    try {

        let currentVideo = req.body.currentVideo;

        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);

        DB.currentVideo = currentVideo;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/videos.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit('getCurrentVideo', DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});


router.post('/:gameNumber', function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let dateClient = req.body.dateClient;

        let data = fs.readFileSync(path.join(__dirname + `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);

        DB.timeData.resultCode = 0;
        DB.timeData.dateClient = dateClient;
        DB.timeData.timeSync = Date.now() - dateClient;

        res.send(DB);

    } catch (e) {
        console.log(e)
    }
});


router.put('/isRunning/:gameNumber', authMW, function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let isRunning = req.body.isRunning;
        let timeDif = req.body.timeDif;
        let timeMem = req.body.timeMem;

        DB.timeData.isRunning = isRunning;
        DB.timeData.timeDif = timeDif;
        DB.timeData.timeMem = timeMem;
        DB.timeData.runningTime = Date.now();


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getVideoTime${gameNumber}`, DB);

    } catch (e) {
        console.log(e)
    }
});


router.options('/', cors());


module.exports = router;