import React from 'react'
import {useState, useEffect} from 'react';
import axios from 'axios';


const TimerForClient = (props) => {

    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();
    const [milliseconds, setMilliseconds] = useState();

    let fetchData = async () => {
        const result = await axios.get(
            `http://localhost:5000/api/timer`
        );

        setMinutes(result.data.minutes);
        setSeconds(result.data.seconds);
        setMilliseconds(result.data.milliseconds);
    };

    useEffect(() => {
        fetchData();
    },[]);


    return (
        <div>
            {<h1> {minutes}:
                {(seconds < 10) ? `0${seconds}` : (seconds == 60) ? '00' : seconds}:
                {(milliseconds < 100)
                    ? `0${milliseconds}`
                    : (milliseconds < 10)
                        ? `00${milliseconds}`
                        : (milliseconds == 0)
                            ? '000'
                            : milliseconds}</h1>
            }
        </div>
    )
};

export default TimerForClient;
