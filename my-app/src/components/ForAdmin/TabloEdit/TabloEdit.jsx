import React from 'react'
import c from './TabloEdit.module.css'
import c1920 from './TabloEdit_1920.module.css'
import {useState, useEffect} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {teamGoal} from "../../../redux/teams_reducer";
import {addNewLog, addNewTempLog} from "../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";


const TabloEdit = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    let width = window.innerWidth;

    const homeTeam = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'home'))
    );

    const guestsTeam = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'guests'))
    );

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
    let minutesStopwatch = Math.floor(timeDif / (1000 * 60)) + (period - 1) * 20 + (smallOvertime * 5) + (bigOvertime * 20);

    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));

    let secondsTimerTimeout = Math.floor(timeMemTimerTimeout / 1000) % 60;

    // useEffect(() => {
    //         tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
    //             setDif(
    //                 (r.serverTime - r.runningTime)
    //                 + (Math.round((Date.now() - r.localTime) / 2))
    //             );
    //
    //         });
    // }, [isRunningServer])
    //
    // useEffect(() => {
    //     if (isRunningServerTimeout) {
    //         tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
    //             setDifTimeout(
    //                 (r.serverTime - r.runningTime)
    //                 + (Math.round((Date.now() - r.localTime) / 2))
    //             );
    //         });
    //     }
    // }, [isRunningServerTimeout])


    useEffect(() => {
        let ajaxStart = Date.now()
        tabloAPI.getTimerStatus(gameNumber).then(r => {
                ////TIMER////
            if (r.isRunning) {
                console.log(1)
                tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
                    setDif(
                        (r.serverTime - r.runningTime)
                        + (Math.round((Date.now() - r.localTime))) + 50
                        + (Date.now() - ajaxStart)
                    );
                    console.log(Date.now() - ajaxStart)
                    console.log((r.serverTime - r.runningTime)
                        + (Math.round((Date.now() - r.localTime))))
                }).then(() => {
                    setIsRunningServer(r.isRunning);
                    setCurrentTime(Date.now());
                    setTimeMem(r.timeData.timeMem);
                    setTimeDif(r.timeData.timeMem);
                    setTimeMemTimer(r.timeData.timeMemTimer);
                    setDeadLine(r.timeData.deadLine);
                    setPeriod(r.period);
                    setSmallOvertime(r.smallOvertime);
                    setBigOvertime(r.bigOvertime);
                    console.log(2)
                })
            } else {
                setIsRunningServer(r.isRunning);
                setCurrentTime(Date.now());
                setTimeMem(r.timeData.timeMem);
                setTimeDif(r.timeData.timeMem);
                setTimeMemTimer(r.timeData.timeMemTimer);
                setDeadLine(r.timeData.deadLine);
                setPeriod(r.period);
                setSmallOvertime(r.smallOvertime);
                setBigOvertime(r.bigOvertime);
            }
                ////TIMEOUT////
                setIsRunningServerTimeout(r.timeoutData.isRunning);
                setCurrentTimeTimeout(Date.now());
                setTimeMemTimeout(r.timeoutData.timeData.timeMem);
                setTimeDifTimeout(r.timeoutData.timeData.timeMem);
                setTimeMemTimerTimeout(r.timeoutData.timeData.timeMemTimer);
                setDeadLineTimeout(r.timeoutData.timeData.deadLine);
            }
        );


        // tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
        //     setDif(
        //         (r.serverTime - r.runningTime)
        //         + (Math.round((Date.now() - r.localTime))) + 10
        //     )
        //     setDifTimeout(
        //         (r.serverTime - r.runningTimeTimeout)
        //         + (Math.round((Date.now() - r.localTime)))
        //     )
        // })


        ////Socket IO////
        socket.on(`getTime${gameNumber}`, time => {
                if (time.isRunning) {
                    tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
                        setDif(
                            (r.serverTime - r.runningTime)
                            + (Math.round((Date.now() - r.localTime))) + 50
                        );
                    }).then(() => {
                        setIsRunningServer(time.isRunning);
                        setCurrentTime(Date.now());
                        setTimeMem(time.timeData.timeMem);
                        setTimeDif(time.timeData.timeMem);
                        setTimeMemTimer(time.timeData.timeMemTimer);
                        setDeadLine(time.timeData.deadLine);
                        setPeriod(time.period);
                        setSmallOvertime(time.smallOvertime);
                        setBigOvertime(time.bigOvertime);
                    })
                }
                if (!time.isRunning) {
                    setDif(0)
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
            }
        );
        socket.on(`getTimeout${gameNumber}`, time => {
                setIsRunningServerTimeout(time.isRunning);
                setCurrentTimeTimeout(Date.now());
                setTimeDifTimeout(time.timeData.timeDif);
                setTimeMemTimeout(time.timeData.timeMem);
                setTimeMemTimerTimeout(time.timeData.timeMemTimer);
                setDeadLineTimeout(time.timeData.deadLine);
                if (!time.isRunning) {
                    setDif(0)
                }
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
                tabloAPI.putTimerStatus(gameNumber, false,
                    0,
                    0,
                    0, 0, period + 1, smallOvertime, bigOvertime)
                dispatch(addNewLog(gameNumber,
                    `Конец ${period} периода`));
                dispatch(addNewTempLog(gameNumber,
                    `Конец ${period} периода`));
            }
            if (period > 3) {
                if (deadLine === 300000) {
                    tabloAPI.putTimerStatus(gameNumber, false,
                        0,
                        0,
                        0, 0, period, smallOvertime + 1, bigOvertime)
                    dispatch(addNewLog(gameNumber,
                        `Конец овертайма`));
                    dispatch(addNewTempLog(gameNumber,
                        `Конец овертайма`));
                }
                if (deadLine === 1200000) {
                    tabloAPI.putTimerStatus(gameNumber, false,
                        0,
                        0,
                        0, 0, period, smallOvertime, bigOvertime + 1);
                    dispatch(addNewLog(gameNumber,
                        `Конец овертайма`));
                    dispatch(addNewTempLog(gameNumber,
                        `Конец овертайма`));
                }
            } else {
                tabloAPI.putTimerStatus(gameNumber, false,
                    0,
                    0,
                    deadLine, deadLine, period + 1, smallOvertime, bigOvertime);
                dispatch(addNewLog(gameNumber,
                    `Конец ${period} периода`));
                dispatch(addNewTempLog(gameNumber,
                    `Конец ${period} периода`));
            }
        }
    }, [timeDif >= deadLine]);

    useEffect(() => {
        if (timeDifTimeout >= deadLineTimeout && isRunningServerTimeout) {
            setIsRunningServerTimeout(false);

            tabloAPI.putTimeoutStatus(gameNumber, false,
                0,
                0,
                0, 0);
            dispatch(addNewLog(gameNumber,
                `Конец таймаута`));
            dispatch(addNewTempLog(gameNumber,
                `Конец таймаута`));
        }
    }, [timeDifTimeout >= deadLineTimeout]);


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
            }, 50);
            return () => clearInterval(interval);
        }
    );

    const addTeamGoal = async (teamType, teamName, symbol) => {
        dispatch(teamGoal(gameNumber, teamType, symbol));
        if (symbol === '+') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - ГОЛ для ${teamName}!`));
            dispatch(addNewTempLog(gameNumber,
                `ГОЛ для ${teamName}!`))
        }
    };

    const startGame = () => {
        tabloAPI.putTimerStatus(gameNumber, true, timeDif, timeMem,
            timeMemTimer, deadLine, period, smallOvertime, bigOvertime);
        dispatch(addNewLog(gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - СТАРТ`));
    };

    const stopGame = () => {
        tabloAPI.putTimerStatus(gameNumber, false,
            Date.now() - currentTime + dif,
            timeMem + (Date.now() - currentTime + dif),
            deadLine - (timeMem + (Date.now() - currentTime + dif)),
            deadLine, period, smallOvertime, bigOvertime);
        dispatch(addNewLog(gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - СТОП`));
    };


    return (
        <div className={width === 1920 ? c1920.tabloEdit : c.tabloEdit}>
            <div className={width === 1920 ? c1920.tablo : c.tablo}>
                <Tablo isShowLog={isShowLog} gameTempLog={gameTempLog} gameConsLog={gameConsLog}
                       secondsTimer={secondsTimer} minutesTimer={minutesTimer} timeMemTimerTimeout={timeMemTimerTimeout}
                       secondsTimerTimeout={secondsTimerTimeout} homeTeam={homeTeam} guestsTeam={guestsTeam}
                       homeCounter={homeCounter} guestsCounter={guestsCounter} timeMemTimer={timeMemTimer}
                       timeMem={timeMem}
                       addTeamGoal={addTeamGoal}
                       gameNumber={gameNumber}/>
            </div>
            <div className={width === 1920 ? c1920.allButtons : c.allButtons}>
                {isRunningServer ?
                    <div className={width === 1920 ? c1920.gameButtons : c.gameButtons}>
                        <div className={width === 1920 ? c1920.gameButtons__Disabled : c.gameButtons__Disabled}>
                            Старт
                        </div>
                        <div
                            className={classNames(width === 1920 ? c1920.gameButtons__Active : c.gameButtons__Active, width === 1920
                                ? c1920.gameButtons__stop : c.gameButtons__stop)}
                            onClick={(e) => stopGame()}>
                            Стоп
                        </div>
                    </div>
                    :
                    <div className={width === 1920 ? c1920.gameButtons : c.gameButtons}>
                        <div className={width === 1920 ? c1920.gameButtons__Active : c.gameButtons__Active}
                             onClick={(e) => startGame()}>
                            Старт
                        </div>
                        <div
                            className={classNames(width === 1920 ? c1920.gameButtons__Disabled : c.gameButtons__Disabled, width === 1920
                                ? c1920.gameButtons__stop : c.gameButtons__stop)}>
                            Стоп
                        </div>
                    </div>
                }
                <div className={width === 1920 ? c1920.beepButtons : c.beepButtons}>
                    <div className={width === 1920 ? c1920.beepButtons_beep : c.beepButtons_beep}>Биип</div>
                    <div className={width === 1920 ? c1920.beepButtons_beep : c.beepButtons_beep}>Биииип</div>
                </div>
            </div>
        </div>
    )
};

export default compose(withRouter)(TabloEdit);
