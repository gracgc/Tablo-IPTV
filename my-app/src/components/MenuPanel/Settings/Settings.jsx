import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import {NavLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateTimeDif} from "../../../redux/tablo_reducer";
import Settings1 from "./Settings1";




const Settings = (props) => {

    let dispatch = useDispatch();


    let [currentTime, setCurrentTime] = useState();
    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState(0);

    let [deadLine, setDeadLine] = useState(50000);
    let [timeMemTimer, setTimeMemTimer] = useState(deadLine);

    let millisecondsStopwatch = timeDif % 1000;
    let secondsStopwatch = Math.floor(timeDif/1000) % 60;
    let minutesStopwatch = Math.floor(timeDif/(1000*60));

    let millisecondsTimer = timeMemTimer % 1000;
    let secondsTimer = Math.floor(timeMemTimer/1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer/(1000*60));


    const [isRunning, setIsRunning] = useState(false);

    let getCurrentTime = () => {
        setCurrentTime(Date.now())
    };

    useEffect(() => {
        setInterval(async () => {
            if (isRunning) {
                if (timeDif > deadLine) {
                    await setIsRunning(false);
                    await setTimeDif(deadLine);
                    await dispatch(updateTimeDif(deadLine));
                    setTimeMemTimer(0);
                } else {
                    dispatch(updateTimeDif(timeMem + (Date.now() - currentTime)));
                    setTimeDif(timeMem + (Date.now() - currentTime));
                    setTimeMemTimer(deadLine - timeDif)
                }
            }
        }, 1000)
    }, [currentTime]);


    let start = () => {
        setIsRunning(true);
        getCurrentTime()
    };

    let stop = () => {
        setIsRunning(false);
        setTimeMem(timeDif);
        dispatch(updateTimeDif(timeDif));
    };

    let reset = async () => {
        dispatch(updateTimeDif(0));
        setTimeMem(0);
        setTimeDif(0);
        setTimeMemTimer(deadLine);
    };



    return (
        <div className={c.settings}>
            <div>Settings</div>
            <div>
                <button onClick={(e) => start()}>Start</button>
                <button onClick={(e) => stop()}>Stop</button>
                <button onClick={(e) => reset()}>Reset</button>
                {/*{timeMemTimer} <br/>*/}
                {/*{minutesStopwatch || '0'}:*/}
                {/*{secondsStopwatch || '0'}:*/}
                {/*{millisecondsStopwatch || '0'}<br/>*/}
                {/*{minutesTimer || '0'}:*/}
                {/*{secondsTimer || '0'}:*/}
                {/*{millisecondsTimer || '0'}*/}
                <Settings1/>
            </div>
            <NavLink to="/" className={c.hov} activeClassName={c.activeLink}>
                <div className={c.navBackButton}>
                    Back to menu
                </div>
            </NavLink>
        </div>
    )
};

export default Settings;

