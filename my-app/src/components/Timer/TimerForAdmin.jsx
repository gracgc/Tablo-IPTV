import React from 'react'
import {useState, useEffect} from 'react';


const TimerForAdmin = (props) => {

    const [minutes, setMinutes] = useState(3);
    const [seconds, setSeconds] = useState(0);
    const [milliseconds, setMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    let fetchData = async () => {
        const result = await axios.get(
            `http://localhost:5000/api/timer`
        );

        setMinutes(result.data.minutes);
        setSeconds(result.data.seconds);
        setMilliseconds(result.data.milliseconds);
    };
    //
    // let fetchDataUpdate = async (minutes, seconds, milliseconds) => {
    //     await axios.put(
    //         `http://localhost:5000/api/timer`,
    //         {minutes: minutes, seconds: seconds, milliseconds: milliseconds}
    //     );
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);
    //
    // useEffect(() => {
    //     setTimeout(async () => {
    //         if (isRunning) {
    //             await fetchDataUpdate(minutes, seconds, milliseconds);
    //         }
    //     }, 50)
    // });

    useEffect(() => {
        let myInterval = setTimeout(async () => {
            if (isRunning) {
                if (milliseconds > 0) {
                    await setMilliseconds(milliseconds - 1);
                }
                if (milliseconds == 0) {
                    if (seconds > 0) {
                        await setMilliseconds(999);
                        await setSeconds(seconds - 1);
                    }
                    if (seconds == 0) {
                        if (minutes > 0) {
                            await setMilliseconds(999);
                            await setSeconds(59);
                            await setMinutes(minutes - 1);
                        }
                        if (minutes == 0) {
                            await resetTimer();
                            clearTimeout(myInterval);

                        }
                    }
                } else {
                    clearTimeout(myInterval)
                }
            }

        }, 1);
    });


    const resetTimer = async () => {
        await (setIsRunning(false));
        await (setMilliseconds(0));
        await (setSeconds(0));
        await (setMinutes(3));
        // await fetchDataUpdate(minutes, seconds, milliseconds)

    };

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
            {isRunning
                ? <button onClick={(e) => setIsRunning(false)}>Stop</button>
                : <button onClick={(e) => setIsRunning(true)}>Start</button>}
            <button onClick={(e) => resetTimer()}>Reset
            </button>
        </div>
    )
};

export default TimerForAdmin;
