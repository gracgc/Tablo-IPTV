import React from 'react'
import c from './TabloEdit.module.css'
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import * as axios from "axios";
import {addNewLog} from "../../../redux/log_reducer";


const TabloEditClient = (props) => {

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

    let [period, setPeriod] = useState();

    let [currentTime, setCurrentTime] = useState(Date.now());

    let [deadLine, setDeadLine] = useState(1200000);

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState(0);
    let [timeMemTimer, setTimeMemTimer] = useState(deadLine);


    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));

    let isCheck = true;

    const getTimerStatus = (gameNumber) => {
        return axios.get(`http://localhost:5000/api/time/${gameNumber}`)
            .then(responce => {
                return responce.data
            });
    };

    const putTimerStatus = (gameNumber, isRunning, currentLocalTime, timeDif, timeMem, timeMemTimer, period) => {
        return axios.put(`http://localhost:5000/api/time/isRunning/${gameNumber}`, {
            isRunning,
            currentLocalTime,
            timeDif,
            timeMem,
            timeMemTimer,
            period
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
                        setPeriod(r.period)
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
                        setPeriod(r.period);
                    }
                }
            })
    };

    useEffect(() => {
        getTimerStatus(gameNumber).then(r => {
                setTimeMem(r.gameTime.timeData.timeMem);
                setTimeDif(r.gameTime.timeData.timeMem);
                setTimeMemTimer(r.gameTime.timeData.timeMemTimer);
                setPeriod(r.period);
            }
        );
    }, []);

    useEffect(() => {
            let interval = setInterval(() => {
                if (isCheck) {
                    checkTimerStatus(gameNumber)
                }

                if (isCheck && isRunningServer) {
                    checkTimerStatus(gameNumber);

                    if (timeDif >= deadLine) {
                        putTimerStatus(gameNumber, false, Date.now(),
                            0,
                            0,
                            deadLine, period + 1);
                        dispatch(addNewLog(gameNumber,
                            `End of ${period} period`));
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
