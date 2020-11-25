import React from 'react'
import c from './TabloEdit.module.css'
import {useState, useEffect} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {teamGoal} from "../../../redux/teams_reducer";
import {addNewLog, addNewTempLog} from "../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import * as axios from "axios";
import socket from "../../../socket/socket";


const TabloEdit = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const homeTeam = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'home'))
    );

    const guestsTeam = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'guests'))
    );

    const homeCounter = homeTeam.counter;

    const guestsCounter = guestsTeam.counter;

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

    let [dif, setDif] = useState(0);
    let [difTimeout, setDifTimeout] = useState(0);


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

    const getTimerStatus = (gameNumber) => {
        return axios.get(`/api/time/${gameNumber}`)
            .then(responce => {
                return responce.data
            });
    };

    const getServerTime = (gameNumber, localTime) => {
        return axios.post(`/api/time/serverTime/${gameNumber}`, {localTime})
            .then(responce => {
                return responce.data
            });
    };

    const putTimerStatus = (gameNumber, isRunning, timeDif,
                            timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime) => {
        return axios.put(`/api/time/isRunning/${gameNumber}`, {
            isRunning,
            timeDif,
            timeMem,
            timeMemTimer,
            deadLine,
            period,
            smallOvertime,
            bigOvertime
        })
    };

    const putTimeoutStatus = (gameNumber, isRunning, timeDif,
                              timeMem, timeMemTimer, deadLine) => {
        return axios.put(`/api/time/isRunningTimeout/${gameNumber}`, {
            isRunning,
            timeDif,
            timeMem,
            timeMemTimer,
            deadLine
        })
    };


    useEffect(() => {
        getTimerStatus(gameNumber).then(r => {
                ////TIMER////
                setIsRunningServer(r.isRunning)
                setCurrentTime(Date.now())
                setTimeMem(r.timeData.timeMem);
                setTimeDif(r.timeData.timeMem);
                setTimeMemTimer(r.timeData.timeMemTimer);
                setDeadLine(r.timeData.deadLine);
                setPeriod(r.period);
                setSmallOvertime(r.smallOvertime);
                setBigOvertime(r.bigOvertime);
                ////TIMEOUT////
                setIsRunningServerTimeout(r.timeoutData.isRunning)
                setCurrentTimeTimeout(Date.now())
                setTimeMemTimeout(r.timeoutData.timeData.timeMem);
                setTimeDifTimeout(r.timeoutData.timeData.timeMem);
                setTimeMemTimerTimeout(r.timeoutData.timeData.timeMemTimer);
                setDeadLineTimeout(r.timeoutData.timeData.deadLine);

                if (r.isRunning) {
                    getServerTime(gameNumber, Date.now()).then(r => {
                        setDif(
                            (r.serverTime - r.runningTime)
                            // - (Math.round((Date.now() - r.localTime)/2))
                        )
                    })
                }
                if (r.timeoutData.isRunning) {
                    getServerTime(gameNumber, Date.now()).then(r => {
                        setDifTimeout(
                            (r.serverTime - r.runningTimeTimeout)
                            // - (Math.round((Date.now() - r.localTime)/2))
                        )
                    })
                }
            }
        )


        ////Socket IO////
        socket.on('getTime', time => {
                getServerTime(gameNumber, Date.now()).then(r => {
                    setDif(
                        (r.serverTime - time.runningTime)
                        // - (Math.round((Date.now() - r.localTime)/2))
                    );
                })
                setIsRunningServer(time.isRunning)
                setCurrentTime(Date.now())
                setTimeMem(time.timeData.timeMem);
                setTimeDif(time.timeData.timeMem);
                setTimeMemTimer(time.timeData.timeMemTimer);
                setDeadLine(time.timeData.deadLine);
                setPeriod(time.period);
                setSmallOvertime(time.smallOvertime);
                setBigOvertime(time.bigOvertime);
            }
        )
        socket.on('getTimeout', time => {
                getServerTime(gameNumber, Date.now()).then(r => {
                    setDifTimeout(
                        (r.serverTime - time.runningTime)
                        // + (Math.round((Date.now() - r.localTime)/2))
                    );
                })
                setIsRunningServerTimeout(time.isRunning)
                setCurrentTimeTimeout(Date.now())
                setTimeDifTimeout(time.timeData.timeDif);
                setTimeMemTimeout(time.timeData.timeMem);
                setTimeMemTimerTimeout(time.timeData.timeMemTimer);
                setDeadLineTimeout(time.timeData.deadLine);
            }
        )
    }, []);

    useEffect(() => {
        setIsShowLog(true);
        setTimeout(() => {
            setIsShowLog(false);
        }, 5000)
    }, [gameTempLogDep.length]);


    useEffect(() => {
        if (timeDif >= deadLine && isRunningServer) {
            setIsRunningServer(false)
            if (period === 3) {
                putTimerStatus(gameNumber, false, Date.now(),
                    0,
                    0,
                    0, 0, period + 1, smallOvertime, bigOvertime)
                dispatch(addNewLog(gameNumber,
                    `End of ${period} period`));
                dispatch(addNewTempLog(gameNumber,
                    `End of ${period} period`));
            }
            if (period > 3) {
                if (deadLine === 300000) {
                    putTimerStatus(gameNumber, false, Date.now(),
                        0,
                        0,
                        0, 0, period, smallOvertime + 1, bigOvertime)
                    dispatch(addNewLog(gameNumber,
                        `End of overtime`));
                    dispatch(addNewTempLog(gameNumber,
                        `End of overtime`));
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
            }
        }
    }, [timeDif >= deadLine])

    useEffect(() => {
        if (timeDifTimeout >= deadLineTimeout && isRunningServerTimeout) {
            setIsRunningServerTimeout(false)

            putTimeoutStatus(gameNumber, false,
                0,
                0,
                0, 0);
            dispatch(addNewLog(gameNumber,
                `End of timeout`));
            dispatch(addNewTempLog(gameNumber,
                `End of timeout`));
        }
    }, [timeDifTimeout >= deadLineTimeout])


    useEffect(() => {
            let interval = setInterval(() => {
                if (isRunningServer) {
                    setTimeDif(timeMem + (Date.now() - currentTime + dif));
                    setTimeMemTimer(deadLine - (timeMem + (Date.now() - currentTime + dif)));
                }
                if (isRunningServerTimeout) {
                    setTimeDifTimeout(timeMemTimeout + (Date.now() - currentTimeTimeout + difTimeout));
                    setTimeMemTimerTimeout(deadLineTimeout - (timeMemTimeout + (Date.now() - currentTimeTimeout + difTimeout)));
                }
            }, 10);
            return () => clearInterval(interval);
        }
    );

    const addTeamGoal = (teamType, teamName) => {
        if (isRunningServer) {
            dispatch(teamGoal(gameNumber, teamType, '+'));
            dispatch(putTimerStatus(gameNumber, false,
                Date.now() - currentTime,
                timeMem + (Date.now() - currentTime),
                deadLine - (timeMem + (Date.now() - currentTime)), deadLine, period, smallOvertime, bigOvertime));
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
        putTimerStatus(gameNumber, true, timeDif, timeMem,
            timeMemTimer, deadLine, period, smallOvertime, bigOvertime);
        dispatch(addNewLog(gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - START`));
    };

    const stopGame = () => {
        putTimerStatus(gameNumber, false,
            Date.now() - currentTime + dif,
            timeMem + (Date.now() - currentTime + dif),
            deadLine - (timeMem + (Date.now() - currentTime + dif)),
            deadLine, period, smallOvertime, bigOvertime);
        dispatch(addNewLog(gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - STOP`));
    };


    return (
        <div className={c.tabloEdit}>
            <div className={c.tablo}>
                <Tablo isShowLog={isShowLog} gameTempLog={gameTempLog} gameConsLog={gameConsLog}
                       secondsTimer={secondsTimer} minutesTimer={minutesTimer} timeMemTimerTimeout={timeMemTimerTimeout}
                       secondsTimerTimeout={secondsTimerTimeout}
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
                    <div onClick={(e) => addTeamGoal('home', homeTeam.name)}
                         className={classNames(c.goalButtons_goal, c.home)}>
                        Goal
                    </div>
                    <div onClick={(e) => addTeamGoal('guests', guestsTeam.name)}
                         className={classNames(c.goalButtons_goal, c.guests)}>
                        Goal
                    </div>
                </div>
            </div>
        </div>
    )
};

export default compose(withRouter)(TabloEdit);
