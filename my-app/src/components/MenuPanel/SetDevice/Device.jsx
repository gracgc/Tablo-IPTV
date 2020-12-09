import React, {useEffect, useState} from "react";
import c from './SetDevice.module.css'
import c1920 from "../SavedGames/SavedGames_1920.module.css";
import socket from "../../../socket/socket";
import * as axios from "axios";


const Device = (props) => {


    return (
        <div className={c.navButton}>
            <div>
                Type: {props.type} <br/>
                ID: {props.id}
            </div>
            {props.type !== 'admin' &&
            <div className={c.changeDeviceType}>
                Назначить тип устройства
            </div>}
        </div>
    )
};

export default Device;

