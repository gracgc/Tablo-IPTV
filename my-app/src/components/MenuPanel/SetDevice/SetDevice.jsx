import React, {useEffect, useState} from "react";
import c from './SetDevice.module.css'
import c1920 from "../SavedGames/SavedGames_1920.module.css";
import socket from "../../../socket/socket";
import * as axios from "axios";
import Device from "./Device";
import {NavLink} from "react-router-dom";



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
        })
    }, []);


    return (
        <div className={c.setDevice}>
            <span className={c.menuTitle}>Настройка устройств</span>
            <div className={c.navbar}>
                {devices.map(d => <Device id={d.id} type={d.type}/>)}
            </div>
            <NavLink to="/">
                <div className={c.navBackButton}>
                    Вернуться в меню
                </div>
            </NavLink>

        </div>
    )
};

export default SetDevice;

