import React, {useEffect, useState} from 'react'
import c from './Info.module.css'
import c1920 from './Info_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame, setGameDataAC} from "../../../../redux/games_reducer";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import socket from "../../../../socket/socket";
import {tabloAPI} from "../../../../api/api";


const Info = (props) => {

    const dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    let width = window.innerWidth;

    let [isRunningServer, setIsRunningServer] = useState(false);

    let [count, setCount] = useState(0);

    let [dif, setDif] = useState();
    let [ping, setPing] = useState();
    let [tick, setTick] = useState(1500);

    let [period, setPeriod] = useState();
    let [smallOvertime, setSmallOvertime] = useState();
    let [bigOvertime, setBigOvertime] = useState();

    let [startTime, setStartTime] = useState();

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

        tabloAPI.getTimerStatus(gameNumber, Date.now()).then(r => {
            setDif(r.timeSync + Math.round((Date.now() - r.dateClient) / 2))
            setPing(Math.round((Date.now() - r.dateClient) / 2))
            setIsRunningServer(r.isRunning);
            return r
        }).then(r => {
            ////TIMER////
            setStartTime(r.runningTime)
            setTimeMem(r.timeData.timeMem);
            setTimeDif(r.timeData.timeMem);
            setTimeMemTimer(r.timeData.timeMemTimer);
            setDeadLine(r.timeData.deadLine);
            setPeriod(r.period);
            setSmallOvertime(r.smallOvertime);
            setBigOvertime(r.bigOvertime);
        })

        ////Socket IO////
        socket.on(`getTime${gameNumber}`, time => {
                setIsRunningServer(time.isRunning);
                setStartTime(time.runningTime)
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

        tabloAPI.getTimerStatus(gameNumber, Date.now()).then(r => {

            if (r.timeSync + Math.round((Date.now() - r.dateClient) / 2) < dif) {
                setDif(r.timeSync + Math.round((Date.now() - r.dateClient) / 2))
                setPing(Math.round((Date.now() - r.dateClient) / 2))
                setIsRunningServer(r.isRunning);
            }

            setTimeout(() => {
                setCount(count + 1)
                if (tick < 5000) {
                    setTick(tick + 500)
                }
            }, tick)
        })

    }, [count])


    useEffect(() => {
            let interval = setInterval(() => {
                if (isRunningServer) {
                    setTimeDif(timeMem + ((Date.now() + dif) - startTime));
                    setTimeMemTimer(deadLine - (timeMem + ((Date.now() + dif) - startTime)));
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
                {period > 3 ? <strong>Овертайм {''}</strong> : <strong>Период {period} {''}</strong>}
                — <strong>Статус</strong>: {gameData.gameStatus === 'Going' ? 'Идет' : 'Остановлена'} — <strong>Время</strong>
                : {minutesStopwatch}:{secondsStopwatch < 10 ? '0' : ''}{secondsStopwatch}
            </div>

        </div>

    )
};

export default compose(withRouter)(Info);