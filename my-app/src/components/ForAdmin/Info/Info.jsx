import React, {useEffect, useState} from 'react'
import c from './Info.module.css'
import c1920 from './Info_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame, setGameDataAC} from "../../../redux/games_reducer";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";


const Info = (props) => {

    const dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    let width = window.innerWidth;

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


    useEffect(() => {
        dispatch(getGame(gameNumber));
        socket.on(`getGame${gameNumber}`, game => {
            dispatch(setGameDataAC(game))
        });
        tabloAPI.getTimerStatus(gameNumber).then(r => {
                ////TIMER////
                setIsRunningServer(r.isRunning);
                setCurrentTime(Date.now());
                setTimeMem(r.timeData.timeMem);
                setTimeDif(r.timeData.timeMem);
                setTimeMemTimer(r.timeData.timeMemTimer);
                setDeadLine(r.timeData.deadLine);
                setPeriod(r.period);
                setSmallOvertime(r.smallOvertime);
                setBigOvertime(r.bigOvertime);
                if (r.isRunning) {
                    tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
                        setDif(
                            (r.serverTime - r.runningTime)
                            // - (Math.round((Date.now() - r.localTime)/2))
                        )
                    })
                }
            }
        );

        ////Socket IO////
        socket.on(`getTime${gameNumber}`, time => {
            tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
                    setDif(
                        (r.serverTime - time.runningTime)
                        // - (Math.round((Date.now() - r.localTime)/2))
                    );
                });
                setIsRunningServer(time.isRunning);
                setCurrentTime(Date.now());
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
        <div className={width === 1920 ? c1920.info : c.info}>
            <div className={width === 1920 ? c1920.nameAndType : c.nameAndType}>
                <strong>{gameData.gameName}</strong> — {gameData.gameType}
            </div>
            <div className={width === 1920 ? c1920.statusAndTime : c.statusAndTime}>
                {period > 3 ? <strong>Overtime {''}</strong> : <strong>Период {period} {''}</strong>}
                — <strong>Статус</strong>: {gameData.gameStatus === 'Going' ? 'Идет' : 'Остановлена'} — <strong>Время</strong>
                : {minutesStopwatch}:{secondsStopwatch < 10 ? '0' : ''}{secondsStopwatch}
            </div>

        </div>

    )
};

export default compose(withRouter)(Info);
