import React, {useEffect, useState} from "react";
import c from './SetDevice.module.css'
import c1920 from "../SavedGames/SavedGames_1920.module.css";
import socket from "../../../socket/socket";
import * as axios from "axios";



const SetDevice = (props) => {

    let [devices, setDevices] = useState([{id: 0, type: 'type'}])

    const getDevices = () => {
        return axios.get(`/api/devices`)
            .then(responce => {
                return responce.data
            });
    };

    useEffect(() => {
        getDevices().then(r => {
            setDevices(r)
        })
        socket.on('getDevices', devices => {
            setDevices(devices)
            console.log(devices)
        })
    }, []);


    return (
        <div className={c.setDevice}>
            <span className={c.menuTitle}>Настройка устройств</span>
            <div className={c.navbar}>
                {devices.map(d => <div className={c.navButton}>ID:{d.id} <br/> Type:{d.type}</div>)}
            </div>

        </div>
    )
};

export default SetDevice;

