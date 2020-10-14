import React from 'react'
import {useState, useEffect} from 'react';



const DateData = (props) => {

    const [c, setC] = useState(0);

    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let myInterval = setTimeout(async () => {
            if (isRunning) {

                setC(Date.now())
            }

        }, 1);
    });



    return (
        <div>
            {c}
            {isRunning
                ? <button onClick={(e) => setIsRunning(false)}>Stop</button>
                : <button onClick={(e) => setIsRunning(true)}>Start</button>}
        </div>

    );
};

export default DateData;
