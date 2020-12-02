import React, {useEffect, useState} from 'react'
import c from './AdminPanel.module.css'
import TeamsParameters from "./Parameters/TeamsParameters";
import TabloEdit from "./TabloEdit/TabloEdit";
import Log from "./Log/Log";
import Info from "./Info/Info";
import AddOptions from "./AddOptions/AddOptions";
import * as axios from "axios";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {useDispatch} from "react-redux";
import socket from "../../socket/socket";
import {putGameNumber, setGameNumberAC} from "../../redux/app_reducer";


const AdminPanel = (props) => {

    let dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const getTimerStatus = (gameNumber) => {
        return axios.get(`/api/time/${gameNumber}`)
            .then(responce => {
                return responce.data
            });
    };

    let [period, setPeriod] = useState();

    useEffect(() => {
        getTimerStatus(gameNumber).then(r => {
                setPeriod(r.period);
            }
        );
        dispatch(putGameNumber(gameNumber))
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
