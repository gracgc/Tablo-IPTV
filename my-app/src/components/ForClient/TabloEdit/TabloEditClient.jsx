import React from 'react'
import c from './TabloEditClient.module.css'
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import TabloClient from "./TabloClient";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import * as axios from "axios";
import {addNewLog, addNewTempLog, getLog} from "../../../redux/log_reducer";
import {getTeams} from "../../../redux/teams_reducer";
import Tablo from "../../ForAdmin/TabloEdit/Tablo";


const TabloEditClient = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const homeCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'home').counter)
    );
    const guestsCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'guests').counter)
    );

    const gameTempLog = useSelector(
        state => state.logPage.logData.tabloLog.tempLog[state.logPage.logData.tabloLog.tempLog.length - 1].item
    );

    const gameConsLog = useSelector(
        state => state.logPage.logData.tabloLog.consLog
    );

    const gameTempLogDep = useSelector(
        state => state.logPage.logData.tabloLog.tempLog
    );

    let [isShowLog, setIsShowLog] = useState(false);

    let [isRunningServer, setIsRunningServer] = useState(false);

    let [isRunningServerTimeout, setIsRunningServerTimeout] = useState(false);

    let [tick, setTick] = useState(100);

    let [currentTime, setCurrentTime] = useState(Date.now());

    let [currentTimeTimeout, setCurrentTimeTimeout] = useState(Date.now());

    let [deadLine, setDeadLine] = useState();

    let [deadLineTimeout, setDeadLineTimeout] = useState();

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();

    let [timeDifTimeout, setTimeDifTimeout] = useState();
    let [timeMemTimeout, setTimeMemTimeout] = useState();
    let [timeMemTimerTimeout, setTimeMemTimerTimeout] = useState();


    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));

    let secondsTimerTimeout = Math.floor(timeMemTimerTimeout / 1000) % 60;

    let isCheck = true;

    const getTimerStatus = (gameNumber) => {
        return axios.get(`http://localhost:5000/api/time/${gameNumber}`)
            .then(responce => {
                return responce.data
            });
    };

    const getTimeoutStatus = (gameNumber) => {
        return axios.get(`http://localhost:5000/api/time/timeout/${gameNumber}`)
            .then(responce => {
                return responce.data
            });
    };


    let checkTimerStatus = (gameNumber) => {
        getTimerStatus(gameNumber).then(r => {
                setIsRunningServer(r.gameTime.isRunning);
                return r
            }
        )
            .then(r => {
                if (r.gameTime.isRunning === isRunningServer) {
                    if (r.gameTime.isRunning === false) {
                        setTimeMem(r.gameTime.timeData.timeMem);
                        setTimeDif(r.gameTime.timeData.timeMem);
                        setTimeMemTimer(r.gameTime.timeData.timeMemTimer);
                        setDeadLine(r.gameTime.timeData.deadLine);
                    }
                }
                if (r.gameTime.isRunning !== isRunningServer) {
                    if (r.gameTime.isRunning === true) {
                        setCurrentTime(r.gameTime.runningTime);
                    }
                    if (r.gameTime.isRunning === false) {
                        setTimeMem(r.gameTime.timeData.timeMem);
                        setTimeDif(r.gameTime.timeData.timeMem);
                        setTimeMemTimer(r.gameTime.timeData.timeMemTimer);
                        setDeadLine(r.gameTime.timeData.deadLine);
                    }
                }
            })
    };

    let checkTimeoutStatus = (gameNumber) => {
        getTimeoutStatus(gameNumber).then(r => {
                setIsRunningServerTimeout(r.isRunning);
                return r
            }
        )
            .then(r => {
                if (r.isRunning === isRunningServerTimeout) {
                    if (r.isRunning === false) {
                        setTimeMemTimeout(r.timeData.timeMem);
                        setTimeDifTimeout(r.timeData.timeMem);
                        setTimeMemTimerTimeout(r.timeData.timeMemTimer);
                        setDeadLineTimeout(r.timeData.deadLine);
                    }
                }
                if (r.isRunning !== isRunningServerTimeout) {
                    if (r.isRunning === true) {
                        setCurrentTimeTimeout(r.runningTime);
                    }
                    if (r.isRunning === false) {
                        setTimeMemTimeout(r.timeData.timeMem);
                        setTimeDifTimeout(r.timeData.timeMem);
                        setTimeMemTimerTimeout(r.timeData.timeMemTimer);
                        setDeadLineTimeout(r.timeData.deadLine);
                    }
                }
            })
    };

    useEffect(() => {
        setIsShowLog(true);
        setTimeout(() => {
            setIsShowLog(false);
        }, 5000)
    }, [gameTempLogDep.length]);

    useEffect(() => {
        getTimerStatus(gameNumber).then(r => {
                setTimeMem(r.gameTime.timeData.timeMem);
                setTimeDif(r.gameTime.timeData.timeMem);
                setTimeMemTimer(r.gameTime.timeData.timeMemTimer);
                setDeadLine(r.gameTime.timeData.deadLine);
                ////TIMEOUT////
                setTimeMemTimeout(r.gameTime.timeoutData.timeData.timeMem);
                setTimeDifTimeout(r.gameTime.timeoutData.timeData.timeMem);
                setTimeMemTimerTimeout(r.gameTime.timeoutData.timeData.timeMemTimer);
                setDeadLineTimeout(r.gameTime.timeoutData.timeData.deadLine);
            }
        );
        dispatch(getTeams(gameNumber));
        dispatch(getLog(gameNumber))
    }, []);

    useEffect(() => {
            let interval = setInterval(() => {
                if (isCheck) {
                    checkTimerStatus(gameNumber);
                    checkTimeoutStatus(gameNumber);
                    dispatch(getTeams(gameNumber));
                    dispatch(getLog(gameNumber))
                }

                if (isCheck && isRunningServer) {
                    checkTimerStatus(gameNumber);
                    checkTimeoutStatus(gameNumber);
                    dispatch(getTeams(gameNumber));
                    dispatch(getLog(gameNumber));

                    setTimeDif(timeMem + (Date.now() - currentTime));
                    setTimeMemTimer(deadLine - (timeMem + (Date.now() - currentTime)));
                }
                if (isCheck && isRunningServerTimeout) {
                    checkTimerStatus(gameNumber);
                    checkTimeoutStatus(gameNumber);
                    dispatch(getLog(gameNumber));
                    dispatch(getTeams(gameNumber));


                    setTimeDifTimeout(timeMemTimeout + (Date.now() - currentTimeTimeout));
                    setTimeMemTimerTimeout(deadLineTimeout - (timeMemTimeout + (Date.now() - currentTimeTimeout)));
                }
            }, tick);
            return () => clearInterval(interval);
        }
    );


    return (
        <div className={c.tabloEdit}>
            <TabloClient isShowLog={isShowLog} gameTempLog={gameTempLog} gameConsLog={gameConsLog}
                         secondsTimer={secondsTimer} minutesTimer={minutesTimer}
                         secondsTimerTimeout={secondsTimerTimeout}
                         homeCounter={homeCounter} guestsCounter={guestsCounter} timeMemTimer={timeMemTimer}
                         gameNumber={gameNumber}/>
        </div>
    )
};

export default compose(withRouter)(TabloEditClient);
