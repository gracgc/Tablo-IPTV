import React from 'react'
import c from './TabloEdit.module.css'
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import * as axios from "axios";
import {getTeams} from "../../../redux/teams_reducer";


const TabloEditClient = (props) => {

    let gameNumber = props.match.params.gameNumber;


    debugger
    const dispatch = useDispatch();

    // useEffect(() => {
    //         dispatch(getTeams(gameNumber))
    //     }
    // );

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

    const putTimerStatus = (isRunning, currentLocalTime, timeDif, timeMem, timeMemTimer) => {
        return axios.put(`http://localhost:5000/api/time/isRunning`, {
            isRunning,
            currentLocalTime,
            timeDif,
            timeMem,
            timeMemTimer
        })
    };

    let checkTimerStatus = () => {
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
                    checkTimerStatus();
                    dispatch(getTeams(gameNumber));
                }

                if (isCheck && isRunningServer) {
                    checkTimerStatus();
                    dispatch(getTeams(gameNumber))

                    if (timeDif >= deadLine) {
                        putTimerStatus(false, 0, deadLine, 0);
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


    return (
        <div className={c.tabloEdit}>
            <Tablo secondsTimer={secondsTimer} minutesTimer={minutesTimer}
                   homeCounter={homeCounter} guestsCounter={guestsCounter}/>
        </div>
    )
};

export default compose(withRouter)(TabloEditClient);
