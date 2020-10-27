import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getTimeData} from "../../../redux/tablo_reducer";


const Settings1 = (props) => {

    let dispatch = useDispatch();

    const timeData = useSelector(
        (state => state.tabloPage.timeData)
    );

    const timeStopwatch = timeData.timeDif;

    const timeTimer = timeData.timeMemTimer;

    const timeStopwatch2 = props.timeDif;

    const timeTimer2 = props.timeMemTimer;


    let isRunning = true;

    useEffect(() => {
        let interval = setInterval(() => {
            if (isRunning) {
                dispatch(getTimeData())
            }
        }, 1000);

        return () => clearInterval(interval);
    });


    let millisecondsStopwatch = timeStopwatch % 1000;
    let secondsStopwatch = Math.floor(timeStopwatch / 1000) % 60;
    let minutesStopwatch = Math.floor(timeStopwatch / (1000 * 60));

    let millisecondsTimer = timeTimer % 1000;
    let secondsTimer = Math.floor(timeTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeTimer / (1000 * 60));

    let millisecondsStopwatch2 = timeStopwatch2 % 1000;
    let secondsStopwatch2 = Math.floor(timeStopwatch2 / 1000) % 60;
    let minutesStopwatch2 = Math.floor(timeStopwatch2 / (1000 * 60));

    let millisecondsTimer2 = timeTimer2 % 1000;
    let secondsTimer2 = Math.floor(timeTimer2 / 1000) % 60;
    let minutesTimer2 = Math.floor(timeTimer2 / (1000 * 60));


    return (
        <div className={c.settings}>
            {/*/!*{timeStopwatch}<br/>*!/*/}
            {/*{minutesStopwatch || '0'}*/}
            {/*:{secondsStopwatch || '0'}*/}
            {/*:{millisecondsStopwatch || '0'}*/}
            {/*<br/><br/><br/>*/}
            {/*/!*{timeTimer}<br/>*!/*/}
            {/*{minutesTimer || '0'}*/}
            {/*:{secondsTimer || '0'}*/}
            {/*:{millisecondsTimer || '0'}*/}
            <br/><br/><br/><br/><br/>
            {/*{timeStopwatch}<br/>*/}
            {minutesStopwatch2 || '0'}
            :{secondsStopwatch2 || '0'}
            :{millisecondsStopwatch2 || '0'}
            <br/><br/><br/>
            {/*{timeTimer}<br/>*/}
            {minutesTimer2 || '0'}
            :{secondsTimer2 || '0'}
            :{millisecondsTimer2 || '0'}
        </div>
    )
};

export default Settings1;
