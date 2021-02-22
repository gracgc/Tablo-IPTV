const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const authMW = require('../middleware/authMW');
const {getVideoDurationInSeconds} = require('get-video-duration');
const cyrillicToTranslit = require('cyrillic-to-translit-js');
const config = require('config');

let url = `${config.get('baseUrl')}:${config.get('port')}`;


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

        fs.writeFileSync(path.join(__dirname, `/DB/videos.json`), json, 'utf8');

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


router.post('/editor/:gameNumber', authMW, function (req, res) {
    try {

        let gameNumber = req.params.gameNumber;

        let video = req.body.video;


        let data = fs.readFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);

        if (DB.videos.length === 0) {
            DB.videos.unshift(
                {
                    "videoName": "|",
                    "videoURL": "",
                    "duration": 3000
                },
                video,
                {
                    "videoName": "|",
                    "videoURL": "",
                    "duration": 3000
                })
        } else {
            DB.videos.unshift(
                {
                    "videoName": "|",
                    "videoURL": "",
                    "duration": 3000
                },
                video
            )
        }


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getVideosEditor${gameNumber}`, DB.videos)

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

        io.emit(`getCurrentVideoEditor${gameNumber}`, DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});

router.put('/editor/delete/:gameNumber', authMW, function (req, res) {
    try {

        let gameNumber = req.params.gameNumber;

        let index = req.body.index;


        let data = fs.readFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);


        DB.videos.splice(index, 2);

        if (index === 0) {
            DB.currentVideo.deletedN += 1
            DB.currentVideo.n = 0
        }


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getVideosEditor${gameNumber}`, DB.videos)

        io.emit(`getCurrentVideoEditor${gameNumber}`, DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});

router.put('/editor/padding/:gameNumber', authMW, function (req, res) {
    try {

        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);

        DB.currentVideo.padding = !DB.currentVideo.padding;


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getCurrentVideoEditor${gameNumber}`, DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});


router.put('/editor/clear/:gameNumber', function (req, res) {
    try {

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB/video_${gameNumber}.json`));
        let DB = JSON.parse(data);

        DB.currentVideo.padding = false;

        DB.currentVideo.n = 0;

        DB.videos = [];


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getVideosEditor${gameNumber}`, DB.videos);
        io.emit(`getCurrentVideoEditor${gameNumber}`, DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});


router.get('/current', function (req, res) {
    try {

        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);

        res.send({currentVideo: DB.currentVideo, currentVideoStream: DB.currentVideoStream})

    } catch (e) {
        console.log(e)
    }
});


router.put('/current/:gameNumber', authMW, function (req, res) {
    try {

        const io = req.app.locals.io;

        let gameNumber = req.params.gameNumber;

        let currentVideo = req.body.currentVideo;

        let isEditor = req.body.isEditor;

        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);

        let data2 = fs.readFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`));
        let DB2 = JSON.parse(data2);

        let playVideoWithPadding = () => {
            DB2.currentVideo.padding = true;

            let json1 = JSON.stringify(DB2);

            fs.writeFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`), json1, 'utf8');

            io.emit(`getCurrentVideoEditor${gameNumber}`, DB2.currentVideo);
            setTimeout(() => {
                DB2.currentVideo.padding = false;

                let json2 = JSON.stringify(DB2);

                fs.writeFileSync(path.join(__dirname, `/DB/video_${gameNumber}.json`), json2, 'utf8');

                io.emit(`getCurrentVideoEditor${gameNumber}`, DB2.currentVideo)
            }, 3000);
        };

        if (!DB2.timeData.isRunning) {
            DB.currentVideo = currentVideo;
            DB.currentVideoStream = currentVideo;

            playVideoWithPadding();

            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname, `/DB/videos.json`), json, 'utf8');

            io.emit('getCurrentVideo', {currentVideo: DB.currentVideo, currentVideoStream: DB.currentVideoStream});

            if (!currentVideo.duration) {
                DB.currentVideoStream = currentVideo;
            }
        } else {
            if (isEditor) {
                DB.currentVideo = currentVideo;

                let json = JSON.stringify(DB);

                fs.writeFileSync(path.join(__dirname, `/DB/videos.json`), json, 'utf8');

                io.emit('getCurrentVideo', {currentVideo: DB.currentVideo, currentVideoStream: DB.currentVideoStream})

            } else {

                if (!currentVideo.duration) {
                    DB.currentVideoStream = currentVideo;

                    let json = JSON.stringify(DB);

                    fs.writeFileSync(path.join(__dirname, `/DB/videos.json`), json, 'utf8');

                    io.emit('getCurrentVideo', {currentVideo: null, currentVideoStream: DB.currentVideoStream})

                }
            }
        }



        res.send({resultCode: 0});


    } catch (e) {
        console.log(e)
    }
});

router.put('/reset', authMW, function (req, res) {
    try {

        let data = fs.readFileSync(path.join(__dirname, `/DB/videos.json`));
        let DB = JSON.parse(data);


        DB.currentVideo = DB.currentVideoStream;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/videos.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit('getCurrentVideo', {currentVideo: DB.currentVideo, currentVideoStream: DB.currentVideoStream})

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


        let video = req.files.file;

        let videoNameEN = cyrillicToTranslit().transform(videoName);

        video.name = `${videoNameEN}.mp4`;

        await video.mv(`${__dirname}/DB/videosMP4/${videoNameEN}.mp4`);


        getVideoDurationInSeconds(`${url}/api/videos/mp4/${videoNameEN}`).then((duration) => {


                if (config.get('port') === 5000) {
                    let data = fs.readFileSync(path.join(__dirname, `/DB/videosMP4_local.json`));
                    let DB = JSON.parse(data);

                    DB.videos.push({
                        videoName: videoName,
                        videoURL: `${url}/api/videos/mp4/${videoNameEN}`,
                        duration: duration * 1000
                    });

                    let json = JSON.stringify(DB);

                    fs.writeFileSync(path.join(__dirname, `/DB/videosMP4_local.json`), json, 'utf8');


                    io.emit('getVideosMP4', DB.videos);

                    res.send({resultCode: 0});

                } else {
                    let data = fs.readFileSync(path.join(__dirname, `/DB/videosMP4.json`));
                    let DB = JSON.parse(data);

                    DB.videos.push({
                        videoName: videoName,
                        videoURL: `${url}/api/videos/mp4/${videoNameEN}`,
                        duration: duration * 1000
                    });


                    let json = JSON.stringify(DB);

                    fs.writeFileSync(path.join(__dirname, `/DB/videosMP4.json`), json, 'utf8');


                    io.emit('getVideosMP4', DB.videos);

                    res.send({resultCode: 0});
                }
            }
        )


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

        if (isRunning !== undefined) {
            DB.timeData.isRunning = isRunning;
        }

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
