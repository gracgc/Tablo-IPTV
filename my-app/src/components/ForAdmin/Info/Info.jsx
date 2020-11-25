import React, {useEffect, useState} from 'react'
import c from './Info.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame, setGameDataAC} from "../../../redux/games_reducer";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import * as axios from "axios";
import socket from "../../../socket/socket";


const Info = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    const dispatch = useDispatch();


    let [isRunningServer, setIsRunningServer] = useState(false);

    let [dif, setDif] = useState(0);

    let [period, setPeriod] = useState();
    let [smallOvertime, setSmallOvertime] = useState();
    let [bigOvertime, setBigOvertime] = useState();

    let [currentTime, setCurrentTime] = useState(Date.now());

    let [deadLine, setDeadLine] = useState();

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();

    let secondsStopwatch = Math.floor(timeDif / 1000) % 60;
    let minutesStopwatch = Math.floor(timeDif / (1000 * 60)) + (period - 1) * 20 + (smallOvertime * 5) + (bigOvertime * 20);


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

    useEffect(() => {
        dispatch(getGame(gameNumber))
        socket.on('getGame', game => {
            dispatch(setGameDataAC(game))
        })
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
                if (r.isRunning) {
                    getServerTime(gameNumber, Date.now()).then(r => {
                        setDif(
                            (r.serverTime - r.runningTime)
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
    }, []);


    useEffect(() => {
            let interval = setInterval(() => {
                if (isRunningServer) {
                    setTimeDif(timeMem + (Date.now() - currentTime + dif));
                    setTimeMemTimer(deadLine - (timeMem + (Date.now() - currentTime + dif)));
                }
            }, 50);
            return () => clearInterval(interval);
        }
    );

    return (
        <div className={c.info}>
            <div className={c.nameAndType}>
                <strong>{gameData.gameName}</strong> — {gameData.gameType}
            </div>
            <div className={c.statusAndTime}>
                {period > 3 ? <strong>Overtime {''}</strong> : <strong>Period {period} {''}</strong>}
                — <strong>Status</strong>: {gameData.gameStatus} — <strong>Time</strong>
                : {minutesStopwatch}:{secondsStopwatch < 10 ? '0' : ''}{secondsStopwatch}
            </div>

        </div>

    )
};

export default compose(withRouter)(Info);
