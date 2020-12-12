import React, {useState} from "react";
import c from './SetDevice.module.css'
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import * as axios from "axios";


const Device = (props) => {

    const [showDeviceMenu, setShowDeviceMenu] = useState(false);

    let devicesMenu = [
        'Main Tablo'
    ]

    const putDeviceType = (deviceType, deviceId) => {
        return axios.put(`/api/devices`, {deviceType, deviceId})
    };


    const openDeviceMenu = (y) => {
        setShowDeviceMenu(!showDeviceMenu)
    };

    const handleClickAway = () => {
        setShowDeviceMenu(false);
    };

    const setDeviceType = (deviceType, deviceId) => {
        putDeviceType(deviceType, deviceId)
        setShowDeviceMenu(!showDeviceMenu)
    };


    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className={c.navButton}>
                <div>
                    Type: {props.type} <br/>
                    ID: {props.id}
                </div>
                {props.type !== 'Admin' &&
                <div>
                    {!showDeviceMenu
                        ? <div className={c.changeDeviceType} onClick={(e) => openDeviceMenu()}>
                            Назначить тип устройства
                        </div>
                        : <div className={c.changeDeviceType} onClick={(e) => openDeviceMenu()}>
                            Выберете устройство
                        </div>
                    }
                    {showDeviceMenu && devicesMenu.map(d => <div className={c.device} onClick={(e) => setDeviceType(d, props.id)}>
                        {d}
                    </div>)}
                </div>
                }
            </div>
        </ClickAwayListener>
    )
};

export default Device;

