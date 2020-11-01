import React from 'react'
import c from './TabloEdit.module.css'
import {useState, useEffect} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {addGoalAC, teamGoal} from "../../../redux/teams_reducer";
import {addNewLog} from "../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import * as axios from "axios";


const TabloEdit = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const homeCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType == 'home').counter)
    );
    const guestsCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType == 'guests').counter)
    );

    let [isRunningServer, setIsRunningServer] = useState(false);

    let [tick, setTick] = useState(100);

    let [currentTime, setCurrentTime] = useState(Date.now());

    let [deadLine, setDeadLine] = useState(1200000);

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState(0);
    let [timeMemTimer, setTimeMemTimer] = useState(deadLine);


    let millisecondsStopwatch = timeDif % 1000;
    let secondsStopwatch = Math.floor(timeDif / 1000) % 60;
    let minutesStopwatch = Math.floor(timeDif / (1000 * 60));

    let millisecondsTimer = timeMemTimer % 1000;
    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));

    let isCheck = true;

    const getTimerStatus = () => {
        return axios.get(`http://localhost:5000/api/time`)
            .then(responce => {
                return responce.data
            });
    };

    const putTimerStatus = (isRunning, timeDif, timeMem, timeMemTimer) => {
        return axios.put(`http://localhost:5000/api/time/isRunning`, {
            isRunning,
            timeDif,
            timeMem,
            timeMemTimer
        })
    };

    let checkTimerStatus = (isStarted) => {
        getTimerStatus().then(r => {
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
                    checkTimerStatus()
                }

                if (isCheck && isRunningServer) {
                    checkTimerStatus();

                    if (timeDif > deadLine) {
                        putTimerStatus(false);
                        setTimeDif(deadLine);
                    } else {
                        setTimeDif(timeMem + (Date.now() - currentTime));
                        setTimeMemTimer(deadLine - (timeMem + (Date.now() - currentTime)));
                    }
                }
            }, tick);
            return () => clearInterval(interval);
        }
    );


    const addTeamGoal = (teamType) => {
        dispatch(teamGoal(gameNumber, teamType, '+'));
        putTimerStatus(false,
            Date.now() - currentTime,
            timeMem + (Date.now() - currentTime),
            deadLine - (timeMem + (Date.now() - currentTime)));
        if (isRunningServer) {
            dispatch(addNewLog(gameNumber,'Timecode: STOP - GOAL!'));
        } else {
            dispatch(addNewLog(gameNumber,'Timecode: GOAL!'));
        }
    };

    const startGame = () => {
        putTimerStatus(true);
        dispatch(addNewLog(gameNumber,'Timecode: START'));
    };

    const stopGame = () => {
        putTimerStatus(false,
            Date.now() - currentTime,
            timeMem + (Date.now() - currentTime),
            deadLine - (timeMem + (Date.now() - currentTime)));
        dispatch(addNewLog(gameNumber,'Timecode: STOP'));
    };

    return (
        <div className={c.tabloEdit}>
            <div className={c.tablo}>
                <Tablo secondsTimer={secondsTimer} minutesTimer={minutesTimer}
                       homeCounter={homeCounter} guestsCounter={guestsCounter}/>
            </div>
            <div className={c.allButtons}>
                {isRunningServer ?
                    <div className={c.gameButtons}>
                        <div className={c.gameButtons__Disabled}>
                            Start
                        </div>
                        <div className={classNames(c.gameButtons__Active, c.gameButtons__stop)} onClick={(e) => stopGame()}>
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
                    <button onClick={(e) => addTeamGoal('home')}
                         className={classNames(c.goalButtons_goal, c.home)}>
                        Goal
                    </button>
                    <button onClick={(e) => addTeamGoal('guests')}
                         className={classNames(c.goalButtons_goal, c.guests)}>
                        Goal
                    </button>
                </div>
            </div>
        </div>
    )
};

export default compose(withRouter)(TabloEdit);
