import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import socket from "../../../socket/socket";
import * as axios from "axios";


const Settings00 = (props) => {

    let [log, setLog] = useState([{log: 1, date: Date.now()}])

    const getTimerStatus = () => {
        return axios.get(`http://localhost:5000/test`)
            .then(responce => {
                return responce.data
            });
    };


    let goTest = () => {
        socket.emit('test', {log: 'test', date: Date.now()})
    }

    useEffect(() => {
        getTimerStatus().then(r => setLog(r))
        socket.on('testGet', log => setLog(log.log))
    }, [])

    return (
        <div className={c.settings}>
            {log.map(l => <div>{l.log}:{l.date}</div>)}
            <button onClick={(e) => goTest()}>test</button>
        </div>
    )
};

export default Settings00;

