import React, {useEffect, useState} from 'react'
import c from './AdminPanel.module.css'
import TeamsParameters from "./Parameters/TeamsParameters";
import TabloEdit from "./TabloEdit/TabloEdit";
import Log from "./Log/Log";
import Info from "./Info/Info";
import AddOptions from "./AddOptions/AddOptions";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {tabloAPI} from "../../../api/api";
import socket from "../../../socket/socket";

const AdminPanel = (props) => {

    let gameNumber = props.match.params.gameNumber;

    let [period, setPeriod] = useState();

    useEffect(() => {
        tabloAPI.getTimerStatus(gameNumber).then(r => {
                setPeriod(r.period);
            }
        );
        socket.on(`getTime${gameNumber}`, time => {
                setPeriod(time.period);
            }
        );
    }, []);

    return (
        <div className={c.adminPanel}>
            <div className={c.adminPanel__info}>
                <Info/>
            </div>
            <div className={c.adminPanel__mainPanel}>
                <div>
                    <Log/>
                </div>
                <div>
                    <TabloEdit/>
                </div>
            </div>
            <div className={c.adminPanel__addPanel}>
                <div>
                    <TeamsParameters/>
                </div>
                <div>
                    <AddOptions period={period}/>
                </div>
            </div>
        </div>

    )
};

export default compose(withRouter)(AdminPanel);