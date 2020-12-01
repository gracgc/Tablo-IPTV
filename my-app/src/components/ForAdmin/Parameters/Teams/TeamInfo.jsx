import React from 'react'
import c from './TeamInfo.module.css'
import c1920 from './TeamInfo_1920.module.css'
import TeamGamers from "./TeamGamers";
import {addNewLog} from "../../../../redux/log_reducer";
import {useDispatch, useSelector} from "react-redux";
import * as axios from "axios";


const TeamInfo = (props) => {

    const dispatch = useDispatch();

    let width = useSelector(
        state => state.appPage.width
    );

    let secondsStopwatch = Math.floor(props.timeMem / 1000) % 60;
    let minutesStopwatch = Math.floor(props.timeMem / (1000 * 60)) + (props.period - 1) * 20;

    const putTimeoutStatus = (gameNumber, isRunning, timeDif,
                              timeMem, timeMemTimer, deadLine) => {
        return axios.put(`/api/time/isRunningTimeout/${gameNumber}`, {
            isRunning,
            timeDif,
            timeMem,
            timeMemTimer,
            deadLine
        })
    };


    let startTimeout = () => {
        putTimeoutStatus(props.gameNumber, true, 0, 0, 30000, 30000);
        dispatch(addNewLog(props.gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - Старт таймаута для ${props.name}`));
    };

    let setTimeout = () => {
        putTimeoutStatus(props.gameNumber, false, 0, 0, 30000, 30000);
        dispatch(addNewLog(props.gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - Таймаут установлен для ${props.name}`));
    };

    let clearTimeout = () => {
        putTimeoutStatus(props.gameNumber, false, 0, 0, 0, 0);
    };

    return (
        <div className={width === 1920 ? c1920.team : c.team}>
            <div className={width === 1920 ? c1920.teamInfo : c.teamInfo}>
                Название команды: {props.name} <br/>
                Очки: {props.teamCounter} <br/>
                Таймаут: {!props.isRunningServer
                    ? <span><span className={width === 1920 ? c1920.timeout : c.timeout} onClick={(e) => setTimeout()}>
                Установить
            </span> <span className={width === 1920 ? c1920.timeout : c.timeout} onClick={(e) => startTimeout()}>
                Старт
            </span> <span className={width === 1920 ? c1920.timeout : c.timeout} onClick={(e) => clearTimeout()}>
                    Очистить
                    </span> <br/></span>
                    : <span><span className={width === 1920 ? c1920.timeoutDis : c.timeoutDis}>
                    Установить
                    </span> <span className={width === 1920 ? c1920.timeoutDis : c.timeoutDis}>
                    Старт
                    </span> <span className={width === 1920 ? c1920.timeout : c.timeout} onClick={(e) => clearTimeout()}>
                    Очистить
                    </span> <br/></span>}

                <div className={width === 1920 ? c1920.tableInfo : c.tableInfo}>
                    <div>
                        <strong>Игроки:</strong>
                    </div>
                    <div>
                        На поле
                    </div>
                </div>
            </div>
            <div className={width === 1920 ? c1920.teamGamers : c.teamGamers}>
                {props.teamGamers.map(htg => <TeamGamers key={htg.id} timeMem={props.timeMem}
                                                         timeMemTimer={props.timeMemTimer}
                                                         period={props.period}
                                                         id={htg.id}
                                                         number={htg.gamerNumber}
                                                         onField={htg.onField}
                                                         fullName={htg.fullName}
                                                         status={htg.status} goals={htg.goals}
                                                         teamType={props.teamType}/>)}
            </div>
        </div>
    )
};


export default TeamInfo;
