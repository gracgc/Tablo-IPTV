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

router.post('/', async function (req, res) {
    try {

        let videoName = req.params.videoName;
        let videoURL = req.params.videoURL;


        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);

        DB.videos.push({
            videoName: videoName,
            videoURL: videoURL
        });

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/videosMP4_local.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit('getVideos', DB.videos)

    } catch (e) {
        console.log(e)
    }
});

router.get('/editor/:gameNumber', function (req, res) {
    try {

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);


        res.send(DB)


    } catch (e) {
        console.log(e)
    }
});

router.put('/editor/current/:gameNumber', authMW, function (req, res) {
    try {

        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);


        DB.currentVideo.n += 1;


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getCurrentVideoEditor${gameNumber}`, DB)

    } catch (e) {
        console.log(e)
    }
});

router.put('/editor/padding/:gameNumber', authMW, function (req, res) {
    try {

        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);

        if (DB.currentVideo.n === 0) {
            DB.currentVideo.padding === true
        } else {
            DB.currentVideo.padding = !DB.currentVideo.padding;
        }





        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getCurrentVideoEditor${gameNumber}`, DB)

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


router.put('/current', authMW, function (req, res) {
    try {

        let currentVideo = req.body.currentVideo;

        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);

        DB.currentVideo = currentVideo;
        DB.currentVideoStream = currentVideo;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/videos.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit('getCurrentVideo', DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});

router.get('/mp4', function (req, res) {
    try {


        let dataLocal = fs.readFileSync(path.join(__dirname, `/DB/videosMP4_local.json`));
        let DBLocal = JSON.parse(dataLocal);

        let data = fs.readFileSync(path.join(__dirname, `/DB/videosMP4.json`));
        let DB = JSON.parse(data);


        if (config.get('port') === 5000) {
            res.send(DBLocal.videos)
        } else {
            res.send(DB.videos)
        }


    } catch (e) {
        console.log(e)
    }
});


router.get('/mp4/:videoName', function (req, res) {
    try {

        let videoName = req.params.videoName;

        let video = path.join(__dirname + `/DB/videosMP4/${videoName}.mp4`);

        res.sendFile(video);

    } catch (e) {
        console.log(e)
    }
});

router.post('/mp4/:videoName', async function (req, res) {
    try {


        const io = req.app.locals.io;

        let videoName = req.params.videoName;


        let video = req.files.file

        video.name = `${videoName}.mp4`

        await video.mv(`${__dirname}/DB/videosMP4/${video.name}`)


        getVideoDurationInSeconds(`${url}/api/videos/mp4/${videoName}`).then((duration) => {


                if (config.get('port') === 5000) {
                    let data = fs.readFileSync(path.join(__dirname, `/DB/videosMP4_local.json`));
                    let DB = JSON.parse(data);

                    DB.videos.push({
                        videoName: videoName,
                        videoURL: `${url}/api/videos/mp4/${videoName}`,
                        duration: duration * 1000
                    })

                    let json = JSON.stringify(DB);

                    fs.writeFileSync(path.join(__dirname, `/DB/videosMP4_local.json`), json, 'utf8');


                    io.emit('getVideosMP4', DB.videos)

                } else {
                    let data = fs.readFileSync(path.join(__dirname, `/DB/videosMP4.json`));
                    let DB = JSON.parse(data);

                    DB.videos.push({
                        videoName: videoName,
                        videoURL: `${url}/api/videos/mp4/${videoName}`,
                        duration: duration * 1000
                    })


                    let json = JSON.stringify(DB);

                    fs.writeFileSync(path.join(__dirname, `/DB/videosMP4.json`), json, 'utf8');


                    io.emit('getVideosMP4', DB.videos)
                }
            }
        )


        res.send({resultCode: 0});


    } catch (e) {
        console.log(e)
    }
});


router.post('/sync/:gameNumber', function (req, res) {
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
