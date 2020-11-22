import React, {useEffect, useState} from "react";
import c from './Settings.module.css'
import socket from "../../../socket/socket";


const Settings00 = (props) => {

    let [log, setLog] = useState([{log: 1, date: Date.now()}])


    let goTest = () => {
        socket.emit('test', {log: 'test', date: Date.now()})
    }

    useEffect(() => {
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

