import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getTimeData, updateTimeDif} from "../../../redux/tablo_reducer";
import Settings from "./Settings";


const Settings1 = (props) => {

    let dispatch = useDispatch();

    const time = useSelector(
        (state => state.tabloPage.timeData.timeDif)
    );

    // useEffect(() => {
    //     dispatch(getTimeData())
    // });

    let isRunning = true;

    useEffect(() => {
        dispatch(getTimeData());
        setInterval(() => {
            if (isRunning) {
                dispatch(getTimeData())
            }
        }, 500);
    }, [time]);

    let millisecondsStopwatch = time % 1000;
    let secondsStopwatch = Math.floor(time/1000) % 60;
    let minutesStopwatch = Math.floor(time/(1000*60));


    return (
        <div className={c.settings}>
            {/*{time}<br/>*/}
            ___ <br/>
            ___ <br/>
            ___ <br/>
            ___ <br/>
            ___ <br/>
                {minutesStopwatch || '0'}
                :{secondsStopwatch || '0'}
                {/*:{millisecondsStopwatch || '0'}*/}
        </div>
    )
};

export default Settings1;
