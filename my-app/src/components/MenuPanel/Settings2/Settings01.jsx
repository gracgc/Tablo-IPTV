import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import * as axios from "axios";


const Settings01 = (props) => {

    const [timeStopwatch, setTimeStopwatch] = useState();
    const [timeTimer, setTimeTimer] = useState();


    const getTime = () => {
        return axios.get(`http://localhost:5000/api/time`)
            .then(responce => {
                return responce.data
            })
    };

    let isRunning = true;

    useEffect(() => {
        let interval = setInterval(() => {
            if (isRunning) {
                getTime().then(r => {
                        setTimeStopwatch(r.timeData.timeDif);
                        setTimeTimer(r.timeData.timeMemTimer)
                    }
                )
            }
        }, 150);

        return () => clearInterval(interval);
    });


    let millisecondsStopwatch = timeStopwatch % 1000;
    let secondsStopwatch = Math.floor(timeStopwatch / 1000) % 60;
    let minutesStopwatch = Math.floor(timeStopwatch / (1000 * 60));

    let millisecondsTimer = timeTimer % 1000;
    let secondsTimer = Math.floor(timeTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeTimer / (1000 * 60));


    return (
        <div className={c.settings}>
            {minutesStopwatch || '0'}
            :{secondsStopwatch || '0'}
            :{millisecondsStopwatch || '0'}
            <br/><br/><br/>
            {minutesTimer || '0'}
            :{secondsTimer || '0'}
            :{millisecondsTimer || '0'}

        </div>
    )
};

export default Settings01;
