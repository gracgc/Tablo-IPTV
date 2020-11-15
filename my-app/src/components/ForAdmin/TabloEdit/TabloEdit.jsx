import React from 'react'
import c from './TabloEdit.module.css'
import {useState, useEffect} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {teamGoal} from "../../../redux/teams_reducer";
import {addNewLog, addNewTempLog, getLog} from "../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import * as axios from "axios";


const TabloEdit = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const homeCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'home').counter)
    );

    const guestsCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'guests').counter)
    );

    const homeTeam = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'home'))
    );

    const guestsTeam = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'guests'))
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

    let [period, setPeriod] = useState();
    let [smallOvertime, setSmallOvertime] = useState();
    let [bigOvertime, setBigOvertime] = useState();

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

    let secondsStopwatch = Math.floor(timeDif / 1000) % 60;
    let minutesStopwatch = Math.floor(timeDif / (1000 * 60)) + (period - 1) * 20;

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

    const putTimerStatus = (gameNumber, isRunning, currentLocalTime, timeDif,
                            timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime) => {
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

    const putTimeoutStatus = (gameNumber, isRunning, currentLocalTime, timeDif,
                              timeMem, timeMemTimer, deadLine) => {
        return axios.put(`http://localhost:5000/api/time/isRunningTimeout/${gameNumber}`, {
            isRunning,
            currentLocalTime,
            timeDif,
            timeMem,
            timeMemTimer,
            deadLine
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
                setPeriod(r.period);
                setSmallOvertime(r.smallOvertime);
                setBigOvertime(r.bigOvertime);
                ////TIMEOUT////
                setTimeMemTimeout(r.gameTime.timeoutData.timeData.timeMem);
                setTimeDifTimeout(r.gameTime.timeoutData.timeData.timeMem);
                setTimeMemTimerTimeout(r.gameTime.timeoutData.timeData.timeMemTimer);
                setDeadLineTimeout(r.gameTime.timeoutData.timeData.deadLine);
            }
        );
        dispatch(getLog(gameNumber))
    }, []);


    useEffect(() => {
            let interval = setInterval(() => {

                if (isCheck) {
                    checkTimerStatus(gameNumber);
                    checkTimeoutStatus(gameNumber);
                    dispatch(getLog(gameNumber));
                    setTick(100)
                }

                if (isCheck && isRunningServer) {
                    checkTimerStatus(gameNumber);
                    checkTimeoutStatus(gameNumber);
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
                                `End of ${period} period`));
                            setTick(2000)
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
                                    `End of overtime`));
                                setTick(2000)
                            }
                            if (deadLine === 1200000) {
                                putTimerStatus(gameNumber, false, Date.now(),
                                    0,
                                    0,
                                    0, 0, period, smallOvertime, bigOvertime + 1);
                                dispatch(addNewLog(gameNumber,
                                    `End of overtime`));
                                dispatch(addNewTempLog(gameNumber,
                                    `End of overtime`));
                                setTick(2000)
                            }
                        } else {
                            putTimerStatus(gameNumber, false, Date.now(),
                                0,
                                0,
                                deadLine, deadLine, period + 1, smallOvertime, bigOvertime);
                            dispatch(addNewLog(gameNumber,
                                `End of ${period} period`));
                            dispatch(addNewTempLog(gameNumber,
                                `End of ${period} period`));
                            setTick(2000)
                        }
                    } else {
                        setTimeDif(timeMem + (Date.now() - currentTime));
                        setTimeMemTimer(deadLine - (timeMem + (Date.now() - currentTime)));
                    }
                }
                if (isCheck && isRunningServerTimeout) {
                    checkTimerStatus(gameNumber);
                    checkTimeoutStatus(gameNumber);
                    dispatch(getLog(gameNumber));

                    if (timeMemTimerTimeout <= 0) {
                        putTimeoutStatus(gameNumber, false, Date.now(),
                            0,
                            0,
                            0, 0);
                        dispatch(addNewLog(gameNumber,
                            `End of timeout`));
                        dispatch(addNewTempLog(gameNumber,
                            `End of timeout`));
                        setTick(5000)
                    } else {
                        setTimeDifTimeout(timeMemTimeout + (Date.now() - currentTimeTimeout));
                        setTimeMemTimerTimeout(deadLineTimeout - (timeMemTimeout + (Date.now() - currentTimeTimeout)));
                    }
                }
            }, tick);
            return () => clearInterval(interval);
        }
    );

    const addTeamGoal = (teamType, teamName) => {
        if (isRunningServer) {
            dispatch(teamGoal(gameNumber, teamType, '+'));
            putTimerStatus(gameNumber, false, Date.now(),
                Date.now() - currentTime,
                timeMem + (Date.now() - currentTime),
                deadLine - (timeMem + (Date.now() - currentTime)), deadLine, period, smallOvertime, bigOvertime);
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - STOP - GOAL for ${teamName}!`));
            dispatch(addNewTempLog(gameNumber,
                `GOAL for ${teamName}!`));
        } else {
            dispatch(teamGoal(gameNumber, teamType, '+'));
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - GOAL for ${teamName}!`));
            dispatch(addNewTempLog(gameNumber,
                `GOAL for ${teamName}!`))
        }
    };

    const startGame = () => {
        putTimerStatus(gameNumber, true, Date.now(), timeDif, timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime);
        dispatch(addNewLog(gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - START`));
    };

    const stopGame = () => {
        putTimerStatus(gameNumber, false, Date.now(),
            Date.now() - currentTime,
            timeMem + (Date.now() - currentTime),
            deadLine - (timeMem + (Date.now() - currentTime)), deadLine, period, smallOvertime, bigOvertime);
        dispatch(addNewLog(gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - STOP`));
    };

    return (
        <div className={c.tabloEdit}>
            <div className={c.tablo}>
                <Tablo isShowLog={isShowLog} gameTempLog={gameTempLog} gameConsLog={gameConsLog}
                       secondsTimer={secondsTimer} minutesTimer={minutesTimer} secondsTimerTimeout={secondsTimerTimeout}
                       homeCounter={homeCounter} guestsCounter={guestsCounter} timeMemTimer={timeMemTimer}
                       gameNumber={gameNumber}/>
            </div>
            <div className={c.allButtons}>
                {isRunningServer ?
                    <div className={c.gameButtons}>
                        <div className={c.gameButtons__Disabled}>
                            Start
                        </div>
                        <div className={classNames(c.gameButtons__Active, c.gameButtons__stop)}
                             onClick={(e) => stopGame()}>
                            Stop
                        </div>
                    </div>
                    :
                    <div className={c.gameButtons}>
                        <div className={c.gameButtons__Active} onClick={(e) => startGame()}>
                            Start
                        </div>
                        <div className={classNames(c.gameButtons__Disabled, c.gameButtons__stop)}>
                            Stop
                        </div>
                    </div>
                }
                <div className={c.beepButtons}>
                    <div className={c.beepButtons_beep}>Beep</div>
                    <div className={c.beepButtons_beep}>Beeeep</div>
                </div>
                <div className={c.goalButtons}>
                    <button onClick={(e) => addTeamGoal('home', homeTeam.name)}
                            className={classNames(c.goalButtons_goal, c.home)}>
                        Goal
                    </button>
                    <button onClick={(e) => addTeamGoal('guests', guestsTeam.name)}
                            className={classNames(c.goalButtons_goal, c.guests)}>
                        Goal
                    </button>
                </div>
            </div>
        </div>
    )
};

export default compose(withRouter)(TabloEdit);
