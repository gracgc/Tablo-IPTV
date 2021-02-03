import React, {useEffect, useState} from 'react'
import c from './Editor.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import socket from "../../../../socket/socket";
import {Draggable, Droppable} from 'react-drag-and-drop'
import {getVideoEditor} from "../../../../redux/videos_reducer";


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

        dispatch(getVideoEditor(gameNumber))

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
        if (videoEditor.editorData.duration - timeDif <= 0) {
            setIsRunningServer(false);
            videosAPI.putVideoTimeStatus(gameNumber, false,
                0,
                0);
        }
    }, [videoEditor.editorData.duration - timeDif <= 0]);

    const startVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, true, timeDif,
            timeMem);
    };

    const stopVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, false,
            timeMem + (Date.now() + dif) - startTime,
            timeMem + ((Date.now() + dif) - startTime));
    };

    const resetVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, false,
            0,
            0);
    };

    let ms = timeDif % 1000;
    let seconds = Math.floor(timeDif / 1000) % 60;
    let minutes = Math.floor(timeDif / (1000 * 60));

    let setCurrentVideo = (currentVideo) => {
        videosAPI.putCurrentVideo(currentVideo)
    };

    let scale = 1500

    let editorStyle = {
        msWidth: (videoEditor.editorData.duration - timeDif)/scale
    };



    let onDrop = (data) => {

        let key = Object.keys(data)

        let firstKey = key[0]

        let k = obj.find(d => d.videoName === data[firstKey])
        console.log(k)
    }

    let obj = [
        {
            videoName: "ВИДЕО1",
            videoURL: "123",
            videoType: "123"
        },
        {
            videoName: "ВИДЕО2",
            videoURL: "123",
            videoType: "123"
        },
        {
            videoName: "ВИДЕО3",
            videoURL: "123",
            videoType: "123"
        }
    ]


    return (
        <div className={c.editor}>
            <div className={c.title}>Редактор</div>
            <div style={{display: 'inline-flex'}}>
                {videoEditor.videos.map(v => <div style={{height: "30px", backgroundColor: 'blue', width: v.duration/scale, textAlign: 'center'}}>{v.videoName}</div>)}
            </div>

            <div style={{width: editorStyle.msWidth, height: "10px", backgroundColor: 'pink'}}>

            </div>
            <div onClick={(e) => startVideo()}>
                Старт
            </div>
            <div onClick={(e) => stopVideo()}>
                Стоп
            </div>
            <div onClick={(e) => resetVideo()}>
                Резет
            </div>
            {minutes}:{seconds}:{ms}

            <Droppable
                types={['video']}
                onDrop={(e) => onDrop(e)}
            >
                <div>Перетаскивать сюда</div>
            </Droppable>


            <Draggable type="video" data={'ВИДЕО1'}>
                <div>Banana</div>
            </Draggable>
            <Draggable type="video" data={'ВИДЕО2'}>
                <div>Lemon</div>
            </Draggable>
            <Draggable type="video" data={'ВИДЕО3'}>
                <div>Lemon</div>
            </Draggable>
        </div>
    )
};

export default compose(withRouter)(Editor);
