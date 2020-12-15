import React from 'react'
import c from './TabloEditClient.module.css'
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import TabloClient from "./TabloClient";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {getLog, setLogDataAC} from "../../../redux/log_reducer";
import {getTeams, setTeamsAC} from "../../../redux/teams_reducer";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";


const TabloEditClient = (props) => {

    let [gameNumber, setGameNumber] = useState(props.match.params.gameNumber);

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


    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));

    let secondsTimerTimeout = Math.floor(timeMemTimerTimeout / 1000) % 60;

    useEffect(() => {
        ////LOAD NEW DATA////
        socket.on('getGameNumber', gameNumberX => {
                props.history.push(`/tabloClient/${gameNumberX}`);

                setGameNumber(gameNumberX)
            }
        );
    }, [])

    useEffect(() => {
        tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
            setDif(
                (r.serverTime - r.runningTime)
                + (Math.round((Date.now() - r.localTime)))
            );
            console.log(Date.now() - r.localTime)
            console.log(r.serverTime - r.runningTime)
        });
    }, [isRunningServer])

    useEffect(() => {
        tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
            setDifTimeout(
                (r.serverTime - r.runningTime)
                + (Math.round((Date.now() - r.localTime)))
            );
        });
    }, [isRunningServerTimeout])


    useEffect(() => {


        ////LOG LOAD///
        dispatch(getLog(gameNumber));
        socket.on(`getLog${gameNumber}`, log => {
                dispatch(setLogDataAC(log))
            }
        );
        ////TEAMS LOAD///
        dispatch(getTeams(gameNumber));
        socket.on(`getTeams${gameNumber}`, teams => {
                dispatch(setTeamsAC(teams))
            }
        );
        ////TIME LOAD////
        tabloAPI.getTimerStatus(gameNumber).then(r => {
                ////TIMER////
                setIsRunningServer(r.isRunning);
                setCurrentTime(Date.now());
                setTimeMem(r.timeData.timeMem);
                setTimeDif(r.timeData.timeMem);
                setTimeMemTimer(r.timeData.timeMemTimer);
                setDeadLine(r.timeData.deadLine);
                ////TIMEOUT////
                setIsRunningServerTimeout(r.timeoutData.isRunning);
                setCurrentTimeTimeout(Date.now());
                setTimeMemTimeout(r.timeoutData.timeData.timeMem);
                setTimeDifTimeout(r.timeoutData.timeData.timeMem);
                setTimeMemTimerTimeout(r.timeoutData.timeData.timeMemTimer);
                setDeadLineTimeout(r.timeoutData.timeData.deadLine);
            }
        );

            tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
                setDif(
                    (r.serverTime - r.runningTime)
                    + (Math.round((Date.now() - r.localTime)))
                )
                console.log(Date.now() - r.localTime)
                console.log(r.serverTime - r.runningTime)
            })


            tabloAPI.getServerTime(gameNumber, Date.now()).then(r => {
                setDifTimeout(
                    (r.serverTime - r.runningTimeTimeout)
                    + (Math.round((Date.now() - r.localTime)))
                )
            })



        ////Socket IO////
        socket.on(`getTime${gameNumber}`, time => {

                setIsRunningServer(time.isRunning);
                setCurrentTime(Date.now());
                setTimeMem(time.timeData.timeMem);
                setTimeDif(time.timeData.timeMem);
                setTimeMemTimer(time.timeData.timeMemTimer);
                setDeadLine(time.timeData.deadLine);
            }
        );
        socket.on(`getTimeout${gameNumber}`, time => {
                setIsRunningServerTimeout(time.isRunning);
                setCurrentTimeTimeout(Date.now());
                setTimeDifTimeout(time.timeData.timeDif);
                setTimeMemTimeout(time.timeData.timeMem);
                setTimeMemTimerTimeout(time.timeData.timeMemTimer);
                setDeadLineTimeout(time.timeData.deadLine);
            }
        )
    }, [gameNumber]);

    useEffect(() => {
        setIsShowLog(true);
        setTimeout(() => {
            setIsShowLog(false);
        }, 5000)
    }, [gameTempLogDep.length]);


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


    return (
        <div className={c.tabloEdit}>
            <TabloClient isShowLog={isShowLog} gameTempLog={gameTempLog} gameConsLog={gameConsLog}
                         secondsTimer={secondsTimer} minutesTimer={minutesTimer}
                         timeMemTimerTimeout={timeMemTimerTimeout}
                         secondsTimerTimeout={secondsTimerTimeout} homeTeam={homeTeam} guestsTeam={guestsTeam}
                         homeCounter={homeCounter} guestsCounter={guestsCounter} timeMemTimer={timeMemTimer}
                         gameNumber={gameNumber}/>
        </div>
    )
};

export default compose(withRouter)(TabloEditClient);
