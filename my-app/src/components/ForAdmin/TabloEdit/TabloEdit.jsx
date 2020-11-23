import React from 'react'
import c from './TabloEdit.module.css'
import {useState, useEffect} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {teamGoal} from "../../../redux/teams_reducer";
import {addNewLog, addNewTempLog, getLog, setLogDataAC} from "../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import * as axios from "axios";
import socket from "../../../socket/socket";
import {getTimeData, putTimeoutStatus, putTimerStatus, setTimeDataAC} from "../../../redux/tablo_reducer";


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

    const gameTime = useSelector(
        state => state.tabloPage.gameTime
    );


    let [isShowLog, setIsShowLog] = useState(false);

    let isRunningServer = useSelector(
        state => state.tabloPage.gameTime.isRunning
    );

    let [isRunningServerTimeout, setIsRunningServerTimeout] = useState(gameTime.timeoutData.isRunning);


    let [period, setPeriod] = useState(gameTime.period);
    let [smallOvertime, setSmallOvertime] = useState(gameTime.smallOvertime);
    let [bigOvertime, setBigOvertime] = useState(gameTime.bigOvertime);

    let currentTime = useSelector(
        state => state.tabloPage.gameTime.runningTime
    );

    let [currentTimeTimeout, setCurrentTimeTimeout] = useState(gameTime.timeoutData.runningTime);

    let [deadLine, setDeadLine] = useState(gameTime.timeData.deadLine);

    let [deadLineTimeout, setDeadLineTimeout] = useState(gameTime.timeoutData.deadLine);

    let timeDif = useSelector(
        state => state.tabloPage.gameTime.timeData.timeDif
    );
    let timeMem = useSelector(
        state => state.tabloPage.gameTime.timeData.timeMem
    );
    let timeMemTimer = useSelector(
        state => state.tabloPage.gameTime.timeData.timeMemTimer
    );

    let [timeDifLocal, setTimeDifLocal] = useState();
    let [timeMemLocal, setTimeMemLocal] = useState();
    let [timeMemTimerLocal, setTimeMemTimerLocal] = useState();

    let [timeDifTimeout, setTimeDifTimeout] = useState(gameTime.timeoutData.timeData.timeDif);
    let [timeMemTimeout, setTimeMemTimeout] = useState(gameTime.timeoutData.timeData.timeMem);
    let [timeMemTimerTimeout, setTimeMemTimerTimeout] = useState(gameTime.timeoutData.timeData.timeMemTimer);

    let secondsStopwatch = Math.floor(timeDifLocal / 1000) % 60;
    let minutesStopwatch = Math.floor(timeDifLocal / (1000 * 60)) + (period - 1) * 20;

    let secondsTimer = Math.floor(timeMemTimerLocal / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimerLocal / (1000 * 60));

    let secondsTimerTimeout = Math.floor(timeMemTimerTimeout / 1000) % 60;

    useEffect(() => {
        dispatch(getTimeData(gameNumber))
        setTimeDifLocal(timeDif)
        setTimeMemLocal(timeMem)
        setTimeMemTimerLocal(timeMemTimer)
        socket.on('getTime', time => {
                dispatch(setTimeDataAC(time))
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
            let interval = setInterval(() => {

                if (isRunningServer) {

                    if (timeDif >= deadLine) {
                        if (period === 3) {
                            dispatch(putTimerStatus(gameNumber, false, Date.now(),
                                0,
                                0,
                                0, 0, period + 1, smallOvertime, bigOvertime))
                            dispatch(addNewLog(gameNumber,
                                `End of ${period} period`));
                            dispatch(addNewTempLog(gameNumber,
                                `End of ${period} period`));
                        }
                        if (period > 3) {
                            if (deadLine === 300000) {
                                dispatch(putTimerStatus(gameNumber, false, Date.now(),
                                    0,
                                    0,
                                    0, 0, period, smallOvertime + 1, bigOvertime))
                                dispatch(addNewLog(gameNumber,
                                    `End of overtime`));
                                dispatch(addNewTempLog(gameNumber,
                                    `End of overtime`));
                            }
                            if (deadLine === 1200000) {
                                dispatch(putTimerStatus(gameNumber, false, Date.now(),
                                    0,
                                    0,
                                    0, 0, period, smallOvertime, bigOvertime + 1));
                                dispatch(addNewLog(gameNumber,
                                    `End of overtime`));
                                dispatch(addNewTempLog(gameNumber,
                                    `End of overtime`));
                            }
                        } else {
                            dispatch(putTimerStatus(gameNumber, false, Date.now(),
                                0,
                                0,
                                deadLine, deadLine, period + 1, smallOvertime, bigOvertime));
                            dispatch(addNewLog(gameNumber,
                                `End of ${period} period`));
                            dispatch(addNewTempLog(gameNumber,
                                `End of ${period} period`));
                        }
                    } else {
                        setTimeDifLocal(timeMemLocal + (Date.now() - currentTime));
                        setTimeMemTimerLocal(deadLine - (timeMemLocal + (Date.now() - currentTime)));
                    }
                }
                if (isRunningServerTimeout) {

                    if (timeMemTimerTimeout <= 0) {
                        dispatch(putTimeoutStatus(gameNumber, false, Date.now(),
                            0,
                            0,
                            0, 0));
                        dispatch(addNewLog(gameNumber,
                            `End of timeout`));
                        dispatch(addNewTempLog(gameNumber,
                            `End of timeout`));

                    } else {
                        setTimeDifTimeout(timeMemTimeout + (Date.now() - currentTimeTimeout));
                        setTimeMemTimerTimeout(deadLineTimeout - (timeMemTimeout + (Date.now() - currentTimeTimeout)));
                    }
                }
            }, 10);
            return () => clearInterval(interval);
        }
    );

    const addTeamGoal = (teamType, teamName) => {
        if (isRunningServer) {
            dispatch(teamGoal(gameNumber, teamType, '+'));
            dispatch(putTimerStatus(gameNumber, false, Date.now(),
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
        dispatch(putTimerStatus(gameNumber, true, Date.now(), timeDifLocal, timeMemLocal,
            timeMemTimerLocal, deadLine, period, smallOvertime, bigOvertime));
        dispatch(addNewLog(gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - START`));
    };

    const stopGame = () => {
        dispatch(putTimerStatus(gameNumber, false, Date.now(),
            Date.now() - currentTime,
            timeMemLocal + (Date.now() - currentTime),
            deadLine - (timeMemLocal + (Date.now() - currentTime)),
            deadLine, period, smallOvertime, bigOvertime));
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
                {isRunningServer} {timeDifLocal} {timeMemTimerLocal}
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
