import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import * as axios from "axios";


const Settings01 = (props) => {


        let [isRunningServer, setIsRunningServer] = useState(false);
        let [isRunningMem, setIsRunningMem] = useState(false);

        let [tick, setTick] = useState(50);

        let [currentTime, setCurrentTime] = useState(Date.now());


        let [deadLine, setDeadLine] = useState(1200000);

        let [dif, setDif] = useState();

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
            return axios.put(`http://localhost:5000/api/time/isRunning`, {isRunning, timeDif, timeMem, timeMemTimer})
        };


        let getCurrentTimeData = () => {
            setCurrentTime(Date.now());
        };

        let checkTimerStatus = (isStarted) => {
            getTimerStatus().then(r => {
                    setIsRunningServer(r.isRunning);
                    setIsRunningMem(r.isRunning);
                    if (r.isRunning !== isRunningServer) {
                        if (r.isRunning === true) {
                            setDif(Date.now() - r.runningTime);
                            setCurrentTime(r.runningTime);
                        }
                        if (r.isRunning === false) {
                            setDif(Date.now() - r.runningTime);
                            setTimeDif(timeMem + r.timeData.timeDif + dif);
                            setTimeMem(r.timeData.timeMem + dif);
                            setTimeMemTimer(r.timeData.timeMemTimer - dif);
                        }
                    }
                }
            )
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
            putTimerStatus(true);
        };

        let stop = () => {
            putTimerStatus(false,
                Date.now() - currentTime,
                timeMem + (Date.now() - currentTime),
                deadLine - (timeMem + (Date.now() - currentTime)));
        };

        let reset = () => {
            setTimeDif(0);
            setTimeMem(0);
            setTimeMemTimer(deadLine)
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
                Dif: {dif}
            </div>
        )
    }
;

export default Settings01;
