import React, {useEffect, useState} from 'react'
import c from './Editor.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import socket from "../../../../socket/socket";
import {Draggable, Droppable} from 'react-drag-and-drop'
import {
    getVideoEditor, getVideosMP4,
    setCurrentVideoDataAC, setCurrentVideoEditorDataAC,
    setVideoEditorDataAC, setVideosEditorAC,
    setVideosMP4DataAC
} from "../../../../redux/videos_reducer";
import EditorLine from "./EditorLine";


const Editor = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();


    let [dif, setDif] = useState();
    let [ping, setPing] = useState();

    let [tick, setTick] = useState(1500);
    let [count, setCount] = useState(0);


    let [isRunningServer, setIsRunningServer] = useState(false);


    let [startTime, setStartTime] = useState();

    let [timeDif, setTimeDif] = useState(0);
    let [timeMem, setTimeMem] = useState(0);

    const videosMP4 = useSelector(
        (state => state.videosPage.videosMP4)
    );

    const currentVideoStream = useSelector(
        (state => state.videosPage.currentVideoStream)
    );

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

        socket.on(`getCurrentVideoEditor${gameNumber}`, currentVideo => {
            dispatch(setCurrentVideoEditorDataAC(currentVideo));
        });

        socket.on(`getVideosEditor${gameNumber}`, videos => {
            dispatch(setVideosEditorAC(videos));
        });

        socket.on(`getCurrentVideo`, currentVideo => {
            dispatch(setCurrentVideoDataAC(currentVideo));
        });
    }, []);


    let setCurrentVideo = (currentVideo) => {
        videosAPI.putCurrentVideo(gameNumber, currentVideo, true)
    };


    let scale = videoEditor.editorData.duration / 660;

    let editorStyle = {
        msWidth: timeDif / scale
    };

    let duration = videoEditor.editorData.duration;

    let currentDuration = duration - timeDif;


    let ms = currentDuration % 1000;
    let seconds = Math.floor(currentDuration / 1000) % 60;
    let minutes = Math.floor(currentDuration / (1000 * 60));


    let duration0 = duration - videos.slice(0, 2 * n).map(v => v.duration)
        .reduce((sum, current) => sum + current, 0);

    let duration1 = duration - videos.slice(0, 2 * n + 1).map(v => v.duration)
        .reduce((sum, current) => sum + current, 0);

    let duration2 = duration - videos.slice(0, 2 * n + 2).map(v => v.duration)
        .reduce((sum, current) => sum + current, 0);

    useEffect(() => {
        if (duration && currentDuration <= 0) {
            setIsRunningServer(false);
            videosAPI.putVideoTimeStatus(gameNumber, false,
                0,
                0);

            videosAPI.clearEditorVideos(gameNumber)
        }
    }, [currentDuration <= 0]);


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

    useEffect(() => {
        if (currentDuration <= videos.map(v => v.duration).slice(0, videoEditor.videos.length - 2)
            .reduce((sum, current) => sum + current, 0) && videoEditor.videos.length !== 3 && videoEditor.videos.length !== 0) {
            videosAPI.deleteVideoFromEditor(gameNumber, 0)
            videosAPI.putVideoTimeStatus(gameNumber, undefined, 0,
                0);
        }
    }, [currentDuration <= videos.map(v => v.duration).slice(0, videoEditor.videos.length - 2)
        .reduce((sum, current) => sum + current, 0) && videoEditor.videos.length !== 3 && videoEditor.videos.length !== 0])

    const startVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, true, timeDif,
            timeMem);
    };


    const clearVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, false,
            0,
            0);
        videosAPI.clearEditorVideos(gameNumber);
        setCurrentVideo(currentVideoStream)
    };


    let onDrop = (data) => {

        let key = Object.keys(data);

        let firstKey = key[0];

        videosAPI.addVideoEditor(gameNumber, videosMP4.find(d => d.videoName === data[firstKey]))

    };


    return (
        <div className={c.editor}>
            <div className={c.title}>Редактор</div>
            <div className={c.editorPlayer}>
                <div style={{display: 'inline-flex'}}>
                    <div>
                        <div style={{display: 'inline-flex'}}>
                            {videos.map((v, index) => <EditorLine v={v} index={index} videoEditor={videoEditor}
                                                                  scale={scale} isRunningServer={isRunningServer}
                                                                  duration={duration} videos={videoEditor.videos}
                            />)}
                            <div className={c.editorLine} style={currentDuration !== 0
                                ? {width: editorStyle.msWidth, height: 140}
                                : {display: "none"}}>
                            </div>
                        </div>
                    </div>
                    {currentDuration <= 3500 && currentDuration !== 0
                        ? <div className={c.droppableVideo} style={{opacity: 0.5}}>Перетаскивать сюда из
                            видеоматериалов</div>

                        : <Droppable
                            types={['video']}
                            onDrop={(e) => onDrop(e)}
                        >
                            <div className={c.droppableVideo}>Перетаскивать сюда из видеоматериалов</div>
                        </Droppable>
                    }
                </div>
                {videos.length !== 0 &&
                <div className={c.playerButtons}>
                    <div className={c.playerButton} onClick={(e) => startVideo()}>
                        Старт
                    </div>
                    <div className={c.playerButton} onClick={(e) => clearVideo()}>
                        Очистить
                    </div>
                    <div className={c.playerTime}>
                        {minutes}:{seconds}:{ms}
                    </div>
                </div>
                }
            </div>
        </div>
    )
};

export default compose(withRouter)(Editor);
