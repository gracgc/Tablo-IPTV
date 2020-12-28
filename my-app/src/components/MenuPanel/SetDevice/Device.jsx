import React, {useState} from "react";
import c from './SetDevice.module.css';
import c1920 from './SetDevice_1920.module.css';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import * as axios from "axios";
import {devicesAPI} from "../../../api/api";


const Device = (props) => {

    let width = window.innerWidth;

    const [showDeviceMenu, setShowDeviceMenu] = useState(false);

    let devicesMenu = [
        'Main Tablo',
        'Video'
    ]

    const openDeviceMenu = (y) => {
        setShowDeviceMenu(!showDeviceMenu)
    };

    const handleClickAway = () => {
        setShowDeviceMenu(false);
    };

    const setDeviceType = (deviceType, deviceId) => {
        devicesAPI.putDeviceType(deviceType, deviceId)
        setShowDeviceMenu(!showDeviceMenu)
    };


    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className={width === 1920 ? c1920.navButton : c.navButton}>
                <div>
                    Type: {props.type} <br/>
                    ID: {props.id}
                </div>
                {props.type !== 'Admin' &&
                <div>
                    {!showDeviceMenu
                        ? <div className={width === 1920 ? c1920.changeDeviceType : c.changeDeviceType}
                               onClick={(e) => openDeviceMenu()}>
                            Назначить тип устройства
                        </div>
                        : <div className={width === 1920 ? c1920.changeDeviceType : c.changeDeviceType}
                               onClick={(e) => openDeviceMenu()}>
                            Выберете устройство
                        </div>
                    }
                    {showDeviceMenu && devicesMenu.map(d => <div className={width === 1920 ? c1920.device : c.device}
                                                                 onClick={(e) => setDeviceType(d, props.id)}>
                        {d}
                    </div>)}
                </div>
                }
            </div>
        </ClickAwayListener>
    )
};

export default Device;

