import React, {useMemo} from 'react'
import c from './TabloClient1.module.css'
import {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";
import useInterval from 'use-interval'
import TabloEventClient from "./TabloEventClient";
import STB from "./STB";


const TabloTimer = (props) => {

    let [gameNumber, setGameNumber] = useState(props.gameNumber);


    let [isRunningServer, setIsRunningServer] = useState(false);

    let [isRunningServerTimeout, setIsRunningServerTimeout] = useState(false);

    let [dif, setDif] = useState();
    let [ping, setPing] = useState();


    let [startTime, setStartTime] = useState();

    let [startTimeout, setStartTimeout] = useState();

    let [deadLine, setDeadLine] = useState();

    let [deadLineTimeout, setDeadLineTimeout] = useState();

    let [timeMem, setTimeMem] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();


    let [timeMemTimeout, setTimeMemTimeout] = useState();
    let [timeMemTimerTimeout, setTimeMemTimerTimeout] = useState();


    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));
    let ms = timeMemTimer % 1000;

    let secondsTimerTimeout = Math.floor(timeMemTimerTimeout / 1000) % 60;

    useEffect(() => {
        ////LOAD NEW DATA////
        socket.on('getGameNumber', gameNumberX => {
                props.history.push(`/tabloClient/${gameNumberX}`);
                setGameNumber(gameNumberX)
            }
        );
    }, [])


    useEffect(() => {

        ////TIME LOAD////
        tabloAPI.getTimerStatus(gameNumber, Date.now()).then(r => {
            let serverPing = Math.round((Date.now() - r.dateClient) / 2);
            let timeSyncServer = r.dateServer - r.dateClient

            setDif(timeSyncServer + serverPing);
            setPing(serverPing);
            setIsRunningServer(r.isRunning)
            setIsRunningServerTimeout(r.timeoutData.isRunning)
            return r
        }).then(r => {
            ////TIMER////
            setStartTime(r.runningTime)
            setTimeMem(r.timeData.timeMem);
            setTimeMemTimer(r.timeData.timeMemTimer);
            setDeadLine(r.timeData.deadLine);
            ////TIMEOUT////
            setStartTimeout(r.timeoutData.runningTime);
            setTimeMemTimeout(r.timeoutData.timeData.timeMem);
            setTimeMemTimerTimeout(r.timeoutData.timeData.timeMemTimer);
            setDeadLineTimeout(r.timeoutData.timeData.deadLine);
        })


        ////Socket IO////
        socket.on(`getTime${gameNumber}`, time => {
                setIsRunningServer(time.isRunning);
                setStartTime(time.runningTime)
                setTimeMem(time.timeData.timeMem);
                setTimeMemTimer(time.timeData.timeMemTimer);
                setDeadLine(time.timeData.deadLine);
            }
        );

        socket.on(`getTimeout${gameNumber}`, time => {
                setIsRunningServerTimeout(time.isRunning);
                setStartTimeout(time.runningTime);
                setTimeMemTimeout(time.timeData.timeMem);
                setTimeMemTimerTimeout(time.timeData.timeMemTimer);
                setDeadLineTimeout(time.timeData.deadLine);
            }
        )
    }, [gameNumber])

    useInterval(() => {
        tabloAPI.getTimerSync(gameNumber, Date.now()).then(r => {

            let serverPing = Math.round((Date.now() - r.dateClient) / 2);
            let timeSyncServer = r.dateServer - r.dateClient

            if (serverPing < ping) {
                setDif(timeSyncServer + serverPing);
                setPing(serverPing);
            }

        })
    }, 3000);


    useEffect(() => {
        let internal = setInterval(() => {
            if (isRunningServer) {
                setTimeMemTimer(deadLine - (timeMem + ((Date.now() + dif) - startTime)));
            }
        }, ms)
        return () => clearInterval(internal)
    })

    // useEffect(() => {
    //     let internal = setInterval(() => {
    //         if (isRunningServerTimeout) {
    //             setTimeMemTimerTimeout(deadLineTimeout - (timeMemTimeout + ((Date.now() + dif) - startTimeout)));
    //         }
    //     }, ms)
    //     return () => clearInterval(internal)
    // })

    // useInterval(() => {
    //     if (isRunningServer) {
    //         setTimeMemTimer(deadLine - (timeMem + ((Date.now() + dif) - startTime)));
    //     }
    // }, ms + 10);
    //
    // useInterval(() => {
    //     if (isRunningServerTimeout) {
    //         setTimeMemTimerTimeout(deadLineTimeout - (timeMemTimeout + ((Date.now() + dif) - startTimeout)));
    //     }
    // }, ms + 10);

    return (
        <div>

            <div>
                {props.preset === 1 &&
                <div style={{
                    textAlign: 'center',
                    position: 'absolute',
                    right: '30px',
                    color: 'green'
                }}>Dif:{dif} Ping:{ping}</div>}
                <STB gameNumber={props.gameNumber}/>
            </div>


            <div className={c.time}>
                {minutesTimer <= 0 ? 0 : minutesTimer}:{secondsTimer < 10 ? '0' : ''}
                {secondsTimer <= 0 ? 0 : secondsTimer}
                :{ms}
            </div>

            {props.preset === 1 &&
            <div>
                {props.isShowLog ? <div className={c.tempLog}>{props.gameTempLog}</div> :
                    <div className={c.tempLog}></div>}

                <div className={secondsTimerTimeout < 6 ? c.timeout5sec : c.timeout}>
                    {(timeMemTimerTimeout > 0) &&
                    `Таймаут ${secondsTimerTimeout} секунд`
                    }
                </div>


                <div className={c.consLogHome}>
                    {props.gameConsLog && props.gameConsLog.filter(gcl => (gcl.item !== '' && gcl.teamType === 'home'))
                        .map((gcl, index) =>
                            <TabloEventClient key={gcl.id}
                                              index={index}
                                              item={gcl.item}
                                              id={gcl.id}
                                              teamType={gcl.teamType}
                                              timeMemTimer={timeMemTimer}
                                              gameNumber={props.gameNumber}
                            />)}
                </div>
                <div className={c.consLogGuests}>
                    {props.gameConsLog && props.gameConsLog.filter(gcl => (gcl.item !== '' && gcl.teamType === 'guests'))
                        .map((gcl, index) =>
                            <TabloEventClient key={gcl.id}
                                              index={index}
                                              item={gcl.item}
                                              id={gcl.id}
                                              teamType={gcl.teamType}
                                              timeMemTimer={timeMemTimer}
                                              gameNumber={gameNumber}
                            />)}
                </div>
            </div>
            }
        </div>


    )
};

export default compose(withRouter)(TabloTimer);
