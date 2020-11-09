import React from 'react'
import c from './TabloEdit.module.css'
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import * as axios from "axios";
import {addNewLog, addNewTempLog, getLog} from "../../../redux/log_reducer";
import {getTeams} from "../../../redux/teams_reducer";


const TabloEditClient = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const homeCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType == 'home').counter)
    );
    const guestsCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType == 'guests').counter)
    );

    const gameTempLog = useSelector(
        state => state.logPage.logData.tabloLog.tempLog[state.logPage.logData.tabloLog.tempLog.length - 1].item
    );

    const gameTempLogDep = useSelector(
        state => state.logPage.logData.tabloLog.tempLog
    );

    let [isShowLog, setIsShowLog] = useState(false);

    let [isRunningServer, setIsRunningServer] = useState(false);

    let [tick, setTick] = useState(100);

    let [period, setPeriod] = useState();
    let [smallOvertime, setSmallOvertime] = useState();
    let [bigOvertime, setBigOvertime] = useState();

    let [currentTime, setCurrentTime] = useState(Date.now());

    let [deadLine, setDeadLine] = useState();

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();


    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));

    let isCheck = true;

    const getTimerStatus = (gameNumber) => {
        return axios.get(`http://localhost:5000/api/time/${gameNumber}`)
            .then(responce => {
                return responce.data
            });
    };

    const putTimerStatus = (gameNumber, isRunning, currentLocalTime, timeDif,
                            timeMem, timeMemTimer, deadline, period, smallOvertime, bigOvertime) => {
        return axios.put(`http://localhost:5000/api/time/isRunning/${gameNumber}`, {
            isRunning,
            currentLocalTime,
            timeDif,
            timeMem,
            timeMemTimer,
            deadLine,
            period,
            smallOvertime,
            bigOvertime
        })
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
                        setPeriod(r.period);
                        setSmallOvertime(r.smallOvertime);
                        setBigOvertime(r.bigOvertime);
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
                        setPeriod(r.period);
                        setSmallOvertime(r.smallOvertime);
                        setBigOvertime(r.bigOvertime);
                    }
                }
            })
    };

    useEffect(() => {
        dispatch(getLog(gameNumber));
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
                setPeriod(r.period);
                setSmallOvertime(r.smallOvertime);
                setBigOvertime(r.bigOvertime);
            }
        );
    }, []);

    useEffect(() => {
            let interval = setInterval(() => {
                if (isCheck) {
                    checkTimerStatus(gameNumber);
                    dispatch(getLog(gameNumber))
                }

                if (isCheck && isRunningServer) {
                    checkTimerStatus(gameNumber);
                    dispatch(getLog(gameNumber));

                    if (timeDif >= deadLine) {
                        if (period === 3) {
                            putTimerStatus(gameNumber, false, Date.now(),
                                0,
                                0,
                                0, 0, period + 1, smallOvertime, bigOvertime);
                            dispatch(addNewLog(gameNumber,
                                `End of ${period} period`));
                            dispatch(addNewTempLog(gameNumber,
                                `End of ${period} period`))
                        }
                        if (period > 3) {
                            if (deadLine === 300000) {
                                putTimerStatus(gameNumber, false, Date.now(),
                                    0,
                                    0,
                                    0, 0, period, smallOvertime + 1, bigOvertime);
                                dispatch(addNewLog(gameNumber,
                                    `End of overtime`));
                                dispatch(addNewTempLog(gameNumber,
                                    `End of overtime`))
                            }
                            if (deadLine === 1200000) {
                                putTimerStatus(gameNumber, false, Date.now(),
                                    0,
                                    0,
                                    0, 0, period, smallOvertime, bigOvertime + 1);
                                dispatch(addNewLog(gameNumber,
                                    `End of overtime`));
                                dispatch(addNewTempLog(gameNumber,
                                    `End of overtime`))
                            }
                        } else {
                            putTimerStatus(gameNumber, false, Date.now(),
                                0,
                                0,
                                deadLine, deadLine, period + 1);
                            dispatch(addNewLog(gameNumber,
                                `End of ${period} period`));
                            dispatch(addNewTempLog(gameNumber,
                                `End of ${period} period`))
                        }
                    } else {
                        setTimeDif(timeMem + (Date.now() - currentTime));
                        setTimeMemTimer(deadLine - (timeMem + (Date.now() - currentTime)));
                    }
                }
            }, tick);
            return () => clearInterval(interval);
        }
    );


    return (
        <div className={c.tabloEdit}>
            <Tablo isShowLog={isShowLog} gameTempLog={gameTempLog}
                   secondsTimer={secondsTimer} minutesTimer={minutesTimer}
                   homeCounter={homeCounter} guestsCounter={guestsCounter}/>
        </div>
    )
};

export default compose(withRouter)(TabloEditClient);
