import React, {useEffect, useState} from 'react'
import c from './Editor.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import socket from "../../../../socket/socket";
import {Draggable, Droppable} from 'react-drag-and-drop'
import {
    getVideoEditor,
    setCurrentVideoDataAC,
    setVideoEditorDataAC,
    setVideosMP4DataAC
} from "../../../../redux/videos_reducer";


const Editor = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();


    let [dif, setDif] = useState();
    let [ping, setPing] = useState();

    let [tick, setTick] = useState(1500);
    let [count, setCount] = useState(0);


    let [isRunningServer, setIsRunningServer] = useState(false);


    let [startTime, setStartTime] = useState();

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState();

    const videoEditor = useSelector(
        (state => state.videosPage.videoEditor)
    );

    let videos = videoEditor.videos.slice().reverse();

    let n = videoEditor.currentVideo.n;


    useEffect(() => {
        videosAPI.getVideoTime(gameNumber, Date.now()).then(r => {
            setDif(r.timeData.timeSync + Math.round((Date.now() - r.timeData.dateClient) / 2));
            setPing(Math.round((Date.now() - r.timeData.dateClient) / 2));
            setIsRunningServer(r.timeData.isRunning);
            return r
        }).then(r => {
            setStartTime(r.timeData.runningTime);
            setTimeMem(r.timeData.timeMem);
            setTimeDif(r.timeData.timeMem);
        });

        dispatch(getVideoEditor(gameNumber));

        socket.on(`getVideoTime${gameNumber}`, time => {
                setIsRunningServer(time.timeData.isRunning);
                setStartTime(time.timeData.runningTime);
                setTimeMem(time.timeData.timeMem);
                setTimeDif(time.timeData.timeMem);
            }
        );
    }, []);

    useEffect(() => {

        videosAPI.getVideoTime(gameNumber, Date.now()).then(r => {

            if (Math.round((Date.now() - r.timeData.dateClient) / 2) < ping) {
                setDif(r.timeData.timeSync + Math.round((Date.now() - r.timeData.dateClient) / 2));
                setPing(Math.round((Date.now() - r.timeData.dateClient) / 2));
                setIsRunningServer(r.timeData.isRunning);
                console.log('video' + dif + ' ' + ping);
            }

            setTimeout(() => {
                setCount(count + 1);
                if (tick < 5000) {
                    setTick(tick + 50)
                }
            }, tick)
        })
    }, [count]);

    useEffect(() => {
            let interval = setInterval(() => {
                if (isRunningServer) {
                    setTimeDif(timeMem + ((Date.now() + dif) - startTime));
                }
            }, 33);
            return () => clearInterval(interval);
        }
    );

    useEffect(() => {
        socket.on(`getVideosMP4`, videosMP4 => {
                dispatch(setVideosMP4DataAC(videosMP4))
            }
        );

        socket.on(`getCurrentVideoEditor${gameNumber}`, editorData => {
            dispatch(setVideoEditorDataAC(editorData));
        });
    }, []);


    const startVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, true, timeDif,
            timeMem);
    };

    // const stopVideo = () => {
    //     videosAPI.putVideoTimeStatus(gameNumber, false,
    //         timeMem + (Date.now() + dif) - startTime,
    //         timeMem + ((Date.now() + dif) - startTime));
    // };

    const resetVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, false,
            0,
            0);
        videosAPI.resetVideoEditor(gameNumber);
        videosAPI.resetCurrentVideo();
    };

    const clearVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, false,
            0,
            0);
        videosAPI.resetVideoEditor(gameNumber);
        videosAPI.resetCurrentVideo();
        videosAPI.clearEditorVideos(gameNumber)
    };

    let ms = timeDif % 1000;
    let seconds = Math.floor(timeDif / 1000) % 60;
    let minutes = Math.floor(timeDif / (1000 * 60));

    let setCurrentVideo = (currentVideo) => {
        videosAPI.putCurrentVideo(gameNumber, currentVideo, true)
    };


    let scale = videoEditor.editorData.duration / 800;

    let editorStyle = {
        msWidth: (videoEditor.editorData.duration - timeDif) / scale
    };


    let currentDuration = videoEditor.editorData.duration - timeDif;


    let duration0 = videoEditor.editorData.duration - videos.slice(0, 2 * n).map(v => v.duration)
        .reduce((sum, current) => sum + current, 0);

    let duration1 = videoEditor.editorData.duration - videos.slice(0, 2 * n + 1).map(v => v.duration)
        .reduce((sum, current) => sum + current, 0);

    let duration2 = videoEditor.editorData.duration - videos.slice(0, 2 * n + 2).map(v => v.duration)
        .reduce((sum, current) => sum + current, 0);

    useEffect(() => {
        if (videoEditor.editorData.duration - timeDif <= 0) {
            setIsRunningServer(false);
            videosAPI.putVideoTimeStatus(gameNumber, false,
                0,
                0);

            videosAPI.resetVideoEditor(gameNumber);
            // videosAPI.clearEditorVideos(gameNumber)
        }
    }, [videoEditor.editorData.duration - timeDif <= 0]);


    useEffect(() => {
        if (isRunningServer) {
            if (currentDuration < duration1
                && duration2 < currentDuration) {
                //videoSTART
                videosAPI.putPaddingVideoEditor(gameNumber);
                videosAPI.putCurrentVideoEditor(gameNumber);
            }
        }
    }, [currentDuration < duration1, duration2 < currentDuration, isRunningServer]);

    useEffect(() => {

        if (isRunningServer) {
            if ((currentDuration < duration0
                && duration1 < currentDuration)) {
                if (videos[2 * n + 1]) {
                    setCurrentVideo(videos[2 * n + 1]); //stop
                } else {
                    videosAPI.resetCurrentVideo();
                }

                videosAPI.putPaddingVideoEditor(gameNumber);

            }
        }
    }, [currentDuration < duration0, duration1 < currentDuration, isRunningServer]);

    let obj = [
        {
            videoName: "ВИДЕО1",
            videoURL: "123",
            duration: 1000
        },
        {
            videoName: "ВИДЕО2",
            videoURL: "123",
            duration: 1000
        },
        {
            videoName: "ВИДЕО3",
            videoURL: "123",
            duration: 1000
        }
    ];


    let onDrop = (data) => {

        let key = Object.keys(data);

        let firstKey = key[0];

        let k = obj.find(d => d.videoName === data[firstKey]);
        console.log(k)
    };


    return (
        <div className={c.editor}>
            <div className={c.title}>Редактор{n}</div>
            <div style={{display: 'inline-flex'}}>
                {videoEditor.videos.map(v => <div className={c.video}
                                                  style={{width: v.duration / scale}}>{v.videoName}</div>)}
            </div>

            <div style={videoEditor.editorData.duration !== 0
                ? {width: editorStyle.msWidth, height: "30px", backgroundColor: 'pink'}
                : {width: 0, height: "30px"}}>

            </div>
            <div style={{display: 'inline-flex'}}>
                <div onClick={(e) => startVideo()}>
                    Старт
                </div>
                <div onClick={(e) => resetVideo()}>
                    Резет
                </div>
                <div onClick={(e) => clearVideo()}>
                    Очистить
                </div>
                {minutes}:{seconds}:{ms}
            </div>


            {/*<Droppable*/}
            {/*    types={['video']}*/}
            {/*    onDrop={(e) => onDrop(e)}*/}
            {/*>*/}
            {/*    <div>Перетаскивать сюда</div>*/}
            {/*</Droppable>*/}


            {/*<Draggable type="video" data={'ВИДЕО1'}>*/}
            {/*    <div>Banana</div>*/}
            {/*</Draggable>*/}
            {/*<Draggable type="video" data={'ВИДЕО2'}>*/}
            {/*    <div>Lemon</div>*/}
            {/*</Draggable>*/}
            {/*<Draggable type="video" data={'ВИДЕО3'}>*/}
            {/*    <div>Lemon</div>*/}
            {/*</Draggable>*/}
        </div>
    )
};

export default compose(withRouter)(Editor);
