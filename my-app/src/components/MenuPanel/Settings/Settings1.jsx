import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getTimeData} from "../../../redux/tablo_reducer";


const Settings1 = (props) => {

    let dispatch = useDispatch();

    const timeStopwatch = useSelector(
        (state => state.tabloPage.timeData.timeDif)
    );

    const timeTimer = useSelector(
        (state => state.tabloPage.timeData.timeMemTimer)
    );


    let isRunning = true;

    useEffect(() => {
        let interval = setInterval(() => {
            if (isRunning) {
                dispatch(getTimeData())
            }
        }, 100);

        return () => clearInterval(interval);
    });


    let millisecondsStopwatch = timeStopwatch % 1000;
    let secondsStopwatch = Math.floor(timeStopwatch / 1000) % 60;
    let minutesStopwatch = Math.floor(timeStopwatch / (1000 * 60));

    let millisecondsTimer = timeTimer % 1000;
    let secondsTimer = Math.ceil(timeTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeTimer / (1000 * 60));


    return (
        <div className={c.settings}>
            {/*{timeStopwatch}<br/>*/}
            {minutesStopwatch || '0'}
            :{secondsStopwatch || '0'}
            {/*:{millisecondsStopwatch || '0'}*/}
            <br/><br/><br/><br/><br/>
            {/*{timeTimer}<br/>*/}
            {minutesTimer || '0'}
            :{secondsTimer || '0'}
            {/*:{millisecondsTimer || '0'}*/}
        </div>
    )
};

export default Settings1;
