import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getTimeData, updateTimeDif} from "../../../redux/tablo_reducer";
import Settings1 from "./Settings1";


const Settings = (props) => {

    let dispatch = useDispatch();

    let timeMemServer = useSelector(
        (state => state.tabloPage.timeData.timeMem)
    );

    let [currentTime, setCurrentTime] = useState();

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState(timeMemServer);
    let [timeMemTimer, setTimeMemTimer] = useState();

    let [deadLine, setDeadLine] = useState(100000);

    const [isRunning, setIsRunning] = useState(false);

    let getCurrentTime = () => {
        setCurrentTime(Date.now());
        dispatch(getTimeData())
    };

    useEffect(() => {
        const interval = setTimeout(() => {
            if (isRunning) {
                if (timeDif > deadLine) {
                    setIsRunning(false);
                    setTimeDif(deadLine);
                    dispatch(updateTimeDif(deadLine, deadLine, 0));
                } else {
                    setTimeDif(timeMem + (Date.now() - currentTime));
                    setTimeMemTimer(deadLine - timeDif);
                    dispatch(updateTimeDif(timeMem + (Date.now() - currentTime), timeMem,
                        deadLine - (timeMem + (Date.now() - currentTime))));
                }
            } else {
                clearTimeout(interval)
            }
        }, 200);

        return () => clearInterval(interval);
    });


    let start = () => {
        setIsRunning(true);
        getCurrentTime()
    };

    let stop = () => {
        setIsRunning(false);
        setTimeMem(timeMem + (Date.now() - currentTime));
        dispatch(updateTimeDif(timeMem + (Date.now() - currentTime),
            timeMem + (Date.now() - currentTime),
            deadLine - (timeMem + (Date.now() - currentTime))));
    };

    let reset = () => {
        setTimeMem(0);
        setTimeMemTimer(deadLine);
        dispatch(updateTimeDif(0, 0, deadLine));

    };


    return (
        <div className={c.settings}>
            <div>Settings</div>
            <div>
                <button onClick={(e) => start()}>Start</button>
                <button onClick={(e) => stop()}>Stop</button>
                <button onClick={(e) => reset()}>Reset</button>
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

