import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getTimeData, updateTimeDif} from "../../../redux/tablo_reducer";


const Settings = (props) => {

    let dispatch = useDispatch();

    const time = useSelector(
        (state => state.tabloPage.timeDif)
    );

    useEffect(() => {
        dispatch(getTimeData())
    });

    let [currentTime, setCurrentTime] = useState();
    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState(0);

    let [deadLine, setDeadLine] = useState(5000);
    let [timeMemTimer, setTimeMemTimer] = useState(deadLine);

    let millisecondsStopwatch = time % 1000;
    let secondsStopwatch = Math.floor(time/1000) % 60;
    let minutesStopwatch = Math.floor(time/(1000*60));

    let millisecondsTimer = timeMemTimer % 1000;
    let secondsTimer = Math.floor(timeMemTimer/1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer/(1000*60));


    const [isRunning, setIsRunning] = useState(false);

    let getCurrentTime = () => {
        setCurrentTime(Date.now())
    };

    useEffect(() => {
        setTimeout(async () => {
            if (isRunning) {
                dispatch(updateTimeDif(timeMem + (Date.now() - currentTime)));
                setTimeDif(timeMem + (Date.now() - currentTime));
                setTimeMemTimer(deadLine - timeDif)
            } if (timeMemTimer < 0) {
                setIsRunning(false);
                setTimeMemTimer(0);
                setTimeDif(deadLine);
                dispatch(updateTimeDif(deadLine));
            }
        }, 100)
    }, [timeDif, currentTime]);


    let start = () => {
        setIsRunning(true);
        getCurrentTime()
    };

    let stop = () => {
        setIsRunning(false);
        setTimeMem(timeDif);
    };

    let reset = async () => {
        setTimeMem(0);
        setTimeDif(0);
        dispatch(updateTimeDif(0));
        setTimeMemTimer(deadLine);
    };



    return (
        <div className={c.settings}>
            <div>Settings</div>
            <div>
                {timeDif || '0'}
                <button onClick={(e) => start()}>Start</button>
                <button onClick={(e) => stop()}>Stop</button>
                <button onClick={(e) => reset()}>Reset</button>
                {timeMemTimer} <br/>
                {minutesStopwatch || '0'}:
                {secondsStopwatch || '0'}:
                {millisecondsStopwatch || '0'}<br/>
                {minutesTimer || '0'}:
                {secondsTimer || '0'}:
                {millisecondsTimer || '0'}
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

const Settings1 = (props) => {

    let dispatch = useDispatch();

    const time = useSelector(
        (state => state.tabloPage.timeDif)
    );

    useEffect(() => {
        dispatch(getTimeData())
    });

    let [currentTime, setCurrentTime] = useState();
    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState(0);

    let [deadLine, setDeadLine] = useState(5000);
    let [timeMemTimer, setTimeMemTimer] = useState(deadLine);

    let millisecondsStopwatch = time % 1000;
    let secondsStopwatch = Math.floor(time/1000) % 60;
    let minutesStopwatch = Math.floor(time/(1000*60));

    let millisecondsTimer = timeMemTimer % 1000;
    let secondsTimer = Math.floor(timeMemTimer/1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer/(1000*60));


    const [isRunning, setIsRunning] = useState(false);

    let getCurrentTime = () => {
        setCurrentTime(Date.now())
    };

    useEffect(() => {
        setTimeout(async () => {
            if (isRunning) {
                dispatch(updateTimeDif(timeMem + (Date.now() - currentTime)));
                setTimeDif(timeMem + (Date.now() - currentTime));
                setTimeMemTimer(deadLine - timeDif)
            } if (timeMemTimer < 0) {
                setIsRunning(false);
                setTimeMemTimer(0);
                setTimeDif(deadLine);
                dispatch(updateTimeDif(deadLine));
            }
        }, 100)
    }, [timeDif, currentTime]);


    let start = () => {
        setIsRunning(true);
        getCurrentTime()
    };

    let stop = () => {
        setIsRunning(false);
        setTimeMem(timeDif);
    };

    let reset = async () => {
        setTimeMem(0);
        setTimeDif(0);
        dispatch(updateTimeDif(0));
        setTimeMemTimer(deadLine);
    };



    return (
        <div className={c.settings}>
            <div>Settings</div>
            <div>
                {timeDif || '0'}
                <button onClick={(e) => start()}>Start</button>
                <button onClick={(e) => stop()}>Stop</button>
                <button onClick={(e) => reset()}>Reset</button>
                {timeMemTimer} <br/>
                {minutesStopwatch || '0'}:
                {secondsStopwatch || '0'}:
                {millisecondsStopwatch || '0'}<br/>
                {minutesTimer || '0'}:
                {secondsTimer || '0'}:
                {millisecondsTimer || '0'}
            </div>
            <NavLink to="/" className={c.hov} activeClassName={c.activeLink}>
                <div className={c.navBackButton}>
                    Back to menu
                </div>
            </NavLink>
        </div>
    )
};
