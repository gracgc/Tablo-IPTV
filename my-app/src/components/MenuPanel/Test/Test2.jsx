import React, {useEffect, useState} from "react";
import c from './Video.module.css'
import c1920 from './Video_1920.module.css'
import useInterval from "use-interval";


const Test2 = (props) => {

    let [load, setLoad] = useState(0)
    let [load2, setLoad2] = useState(0)

    let [a, setA] = useState(false)
    let [b, setB] = useState(false)


    useInterval(() => {
        if (a) {
            setLoad(Date.now())
        }
        if (b) {
            setLoad2(Date.now())
        }
    }, 10);


    return (
        <div style={{background: 'black'}}>
            <div style={{color: 'white'}}>
                {load} <br/>
                {load2} <br/>

                <button onClick={e => setA(true)}>Go</button>
                <button onClick={e => setA(false)}>Stop</button>
                <br/>

                <button onClick={e => setB(true)}>Go</button>
                <button onClick={e => setB(false)}>Stop</button>

            </div>

        </div>
    )
}

export default Test2;