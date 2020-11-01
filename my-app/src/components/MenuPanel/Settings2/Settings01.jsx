import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import * as axios from "axios";


const Settings01 = (props) => {

        let [isRunningServer, setIsRunningServer] = useState(false);

        let [tick, setTick] = useState(100);

        let [dif, setDif] = useState();

        let [ping, setPing] = useState();

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
                            setDif(Date.now() - r.runningTime)
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


        let start = () => {
            putTimerStatus(true, Date.now());
        };

        let stop = () => {
            putTimerStatus(false, Date.now(),
                Date.now() - currentTime,
                timeMem + (Date.now() - currentTime),
                deadLine - (timeMem + (Date.now() - currentTime)));
        };

        let reset = () => {
            putTimerStatus(false, Date.now(),
                0,
                0,
                deadLine);
        };


        return (
            <div className={c.settings}>
                <div>
                    <button onClick={(e) => start()}>Start</button>
                    <button onClick={(e) => stop()}>Stop</button>
                    <button onClick={(e) => reset()}>Reset</button>
                </div>
                {minutesStopwatch || '0'}
                :{secondsStopwatch || '0'}
                :{millisecondsStopwatch || '0'}
                <br/><br/><br/>
                {minutesTimer || '0'}
                :{secondsTimer || '0'}
                :{millisecondsTimer || '0'}
                <br/><br/><br/>
                {isRunningServer ? 'yes' : 'no'}
                <br/>
                Dif:{dif}
            </div>
        )
    }
;

export default Settings01;
