import React, {useEffect, useState} from "react";
import c from './Video.module.css'
import c1920 from './Video_1920.module.css'
import useInterval from "use-interval";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";


const Test2 = (props) => {

    let [load, setLoad] = useState(0)

    let [a, setA] = useState(true)


    let [isRunningServer, setIsRunningServer] = useState(false);

    let [dif, setDif] = useState(0);
    let [ping, setPing] = useState(0);
    let tick = 1000;

    let [startTime, setStartTime] = useState();


    let [deadLine, setDeadLine] = useState();


    let [timeMem, setTimeMem] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();


    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));
    let ms = timeMemTimer % 1000;






    useEffect(() => {

        ////TIME LOAD////
        tabloAPI.getTimerStatus(3, Date.now()).then(r => {
            let serverPing = Math.round((Date.now() - r.dateClient) / 2);
            let timeSyncServer = r.dateServer - r.dateClient

            setDif(timeSyncServer + serverPing);
            setPing(serverPing);
            setIsRunningServer(r.isRunning)
            return r
        }).then(r => {
            ////TIMER////
            setStartTime(r.runningTime)
            setTimeMem(r.timeData.timeMem);
            setTimeMemTimer(r.timeData.timeMemTimer);
            setDeadLine(r.timeData.deadLine);
        })


        ////Socket IO////
        socket.on(`getTime${3}`, time => {
                setIsRunningServer(time.isRunning);
                setStartTime(time.runningTime)
                setTimeMem(time.timeData.timeMem);
                setTimeMemTimer(time.timeData.timeMemTimer);
                setDeadLine(time.timeData.deadLine);
            }
        );

    }, [3])

    useInterval(() => {
        tabloAPI.getTimerSync(3, Date.now()).then(r => {

            let serverPing = Math.round((Date.now() - r.dateClient) / 2);
            let timeSyncServer = r.dateServer - r.dateClient

            if (serverPing < ping) {
                setDif(timeSyncServer + serverPing);
                setPing(serverPing);
            }

        })
    }, 1000);


    useInterval(() => {
        if (isRunningServer) {
            setTimeMemTimer(deadLine - (timeMem + ((Date.now() + dif) - startTime)));
        }
    }, 1000);



    let seconds = Math.floor(load / 1000) % 60;


    return (
        <div style={{background: 'black'}}>
            <div style={{color: 'white', fontSize: 400}}>
                {secondsTimer}:{ms.length === 2 ? '0' : ms.length === 1 ? '00' : ''}{ms} <br/>

                <button onClick={e => setA(true)}>Go</button>
                <button onClick={e => setA(false)}>Stop</button>
            </div>

        </div>
    )
}

export default Test2;