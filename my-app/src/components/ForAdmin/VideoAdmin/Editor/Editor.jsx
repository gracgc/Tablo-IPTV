import React, {useEffect, useRef, useState} from 'react'
import c from './Editor.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {tabloAPI, videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import socket from "../../../../socket/socket";
import { Draggable, Droppable } from 'react-drag-and-drop'


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

    const videos = useSelector(
        (state => state.videosPage.videos)
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

        socket.on(`getVideoTime${gameNumber}`, time => {
                setIsRunningServer(time.timeData.isRunning);
                setStartTime(time.timeData.runningTime);
                setTimeMem(time.timeData.timeMem);
                setTimeDif(time.timeData.timeMem);
            }
        );
    }, []);

    useEffect(() => {

        tabloAPI.getTimerStatus(gameNumber, Date.now()).then(r => {

            if (Math.round((Date.now() - r.timeData.dateClient) / 2) < ping) {
                setDif(r.timeData.timeSync + Math.round((Date.now() - r.timeData.dateClient) / 2));
                setPing(Math.round((Date.now() - r.timeData.dateClient) / 2));
                setIsRunningServer(r.timeData.isRunning);
            }
            console.log(dif + ' ' + ping);
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

    let editorStyle = {
      msWidth: timeDif/50
    };

    let [a, setA] = useState('a');

    let onDrop = (data) => {
        let key = Object.keys(data);

        let firstKey = key[0];

        let k = obj.find(d => d.videoName === data[firstKey]);
        console.log(k)
        // console.log(firstKey)
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
                types={['fruit']} // <= allowed drop types
                onDrop={(e) => onDrop(e)}
                >
                <div>{a}</div>
            </Droppable>


            <Draggable type="fruit" data={'ВИДЕО1'}><div>Banana</div></Draggable>
            <Draggable type="fruit" data="Lemon"><div>Lemon</div></Draggable>

        </div>
    )
};

export default compose(withRouter)(Editor);
