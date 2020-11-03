import React, {useEffect, useState} from 'react'
import c from './Info.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame} from "../../../redux/games_reducer";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import * as axios from "axios";



const Info = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    const dispatch = useDispatch();

    let [isRunningServer, setIsRunningServer] = useState(false);

    let [tick, setTick] = useState(100);

    let [currentTime, setCurrentTime] = useState(Date.now());

    let [deadLine, setDeadLine] = useState(1200000);

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState(0);
    let [timeMemTimer, setTimeMemTimer] = useState(deadLine);

    let secondsStopwatch = Math.floor(timeDif / 1000) % 60;
    let minutesStopwatch = Math.floor(timeDif / (1000 * 60));

    let isCheck = true;

    const getTimerStatus = (gameNumber) => {
        return axios.get(`http://localhost:5000/api/time/${gameNumber}`)
            .then(responce => {
                return responce.data
            });
    };

    const putTimerStatus = (gameNumber, isRunning, currentLocalTime, timeDif, timeMem, timeMemTimer) => {
        return axios.put(`http://localhost:5000/api/time/isRunning/${gameNumber}`, {
            isRunning,
            currentLocalTime,
            timeDif,
            timeMem,
            timeMemTimer
        })
    };

    let checkTimerStatus = (gameNumber) => {
        getTimerStatus(gameNumber).then(r => {
                setIsRunningServer(r.isRunning);
                return r
            }
        )
            .then(r => {
                if (r.isRunning === isRunningServer) {
                    if (r.isRunning === false) {
                        setTimeMem(r.timeData.timeMem);
                        setTimeDif(r.timeData.timeMem);
                        setTimeMemTimer(r.timeData.timeMemTimer);
                    }
                }
                if (r.isRunning !== isRunningServer) {
                    if (r.isRunning === true) {
                        setCurrentTime(r.runningTime);
                    }
                    if (r.isRunning === false) {
                        setTimeMem(r.timeData.timeMem);
                        setTimeDif(r.timeData.timeMem);
                        setTimeMemTimer(r.timeData.timeMemTimer);
                    }
                }
            })
    };


    useEffect(() => {
            let interval = setInterval(() => {
                if (isCheck) {
                    checkTimerStatus(gameNumber);
                    dispatch(getGame(gameNumber));
                }

                if (isCheck && isRunningServer) {
                    checkTimerStatus(gameNumber);
                    dispatch(getGame(gameNumber));

                    if (timeDif >= deadLine) {
                        putTimerStatus(gameNumber, false, Date.now(),
                            0,
                            0,
                            deadLine);
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
               <strong>Status</strong>: {gameData.gameStatus} — <strong>Time</strong>
                : {minutesStopwatch}:{secondsStopwatch < 10 ? '0' : ''}{secondsStopwatch}
            </div>

        </div>

    )
};

export default compose(withRouter)(Info);
