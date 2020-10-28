import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import * as axios from "axios";


const Settings01 = (props) => {


        let [isRunningServer, setIsRunningServer] = useState(false);
        let [isRunningMem, setIsRunningMem] = useState(false);

        let [currentTime, setCurrentTime] = useState(Date.now());

        let [dif, setDif] = useState(0);

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

        const putTimerStatus = (isRunning) => {
            return axios.put(`http://localhost:5000/api/time/isRunning`, {isRunning})
        };


        const getTimerDif = (currentTime) => {
            return axios.post(`http://localhost:5000/api/time/dif`, {currentTime})
                .then(responce => {
                    return responce.data
                });
        };

        let getCurrentTimeData = () => {
            setCurrentTime(Date.now());
        };

        let checkTimerStatus = (isStarted) => {
            getTimerStatus().then(r => {
                    setIsRunningServer(r.isRunning);
                    setIsRunningMem(r.isRunning);
                    return r.isRunning
                }
            ).then(r => {
                if (r !== isRunningMem) {
                    getTimerDif(Date.now())
                        .then(r => setDif(r.dif + 25));
                    setCurrentTime(Date.now());
                    if (r === false) {
                        setTimeMem(timeMem + (Date.now() - currentTime));
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
                        getTimerStatus().then(r => {
                                setIsRunningServer(r.isRunning);
                                setIsRunningMem(r.isRunning);
                                return r.isRunning
                            }
                        ).then(r => {
                            if (r !== isRunningMem) {

                                setCurrentTime(Date.now());
                                if (r === false) {
                                    setTimeMem(timeMem + (Date.now() - currentTime));
                                }
                            }
                        })

                        if (timeDif > deadLine) {
                            putTimerStatus(false);
                            setTimeDif(deadLine);
                        } else {
                            setTimeDif(timeMem + (Date.now() + dif - currentTime));
                            setTimeMemTimer(deadLine - (timeMem + (Date.now() + dif - currentTime)));
                        }
                    }
                }, 50);
                return () => clearInterval(interval);
            }
        );


        let start = () => {
            putTimerStatus(true);
        };

        let stop = () => {
            putTimerStatus(false);
        };

        let reset = () => {
            setTimeDif(0);
            setTimeMem(0);
            setTimeMemTimer(deadLine);
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
                Delta: {dif}
            </div>
        )
    }
;

export default Settings01;
