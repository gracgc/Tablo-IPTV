import React, {useEffect, useState} from 'react'
import c from './Info.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame} from "../../../redux/games_reducer";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import * as axios from "axios";
import {addNewLog, addNewTempLog} from "../../../redux/log_reducer";


const Info = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    const dispatch = useDispatch();

    let [isRunningServer, setIsRunningServer] = useState();

    let [tick, setTick] = useState(100);

    let [currentTime, setCurrentTime] = useState(Date.now());

    let [deadLine, setDeadLine] = useState();

    let [period, setPeriod] = useState();
    let [smallOvertime, setSmallOvertime] = useState();
    let [bigOvertime, setBigOvertime] = useState();

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();

    let secondsStopwatch = Math.floor(timeDif / 1000) % 60;
    let minutesStopwatch = Math.floor(timeDif / (1000 * 60)) + (period - 1) * 20 + (smallOvertime * 5) + (bigOvertime * 20);

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
        getTimerStatus(gameNumber).then(r => {
                setTimeMem(r.gameTime.timeData.timeMem);
                setTimeDif(r.gameTime.timeData.timeMem);
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
                    dispatch(getGame(gameNumber))
                }

                if (isCheck && isRunningServer) {
                    checkTimerStatus(gameNumber);
                    dispatch(getGame(gameNumber));

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
                            }
                            if (deadLine === 1200000) {
                                putTimerStatus(gameNumber, false, Date.now(),
                                    0,
                                    0,
                                    0, 0, period, smallOvertime, bigOvertime + 1);
                            }
                        } else {
                            putTimerStatus(gameNumber, false, Date.now(),
                                0,
                                0,
                                deadLine, deadLine, period + 1, smallOvertime, bigOvertime);
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
        <div className={c.info}>
            <div className={c.nameAndType}>
                <strong>{gameData.gameName}</strong> — {gameData.gameType}
            </div>
            <div className={c.statusAndTime}>
                {period > 3 && <strong>Overtime {''}</strong> || <strong>Period {gameData.period} {''}</strong>}
                — <strong>Status</strong>: {gameData.gameStatus} — <strong>Time</strong>
                : {minutesStopwatch}:{secondsStopwatch < 10 ? '0' : ''}{secondsStopwatch}
            </div>

        </div>

    )
};

export default compose(withRouter)(Info);
