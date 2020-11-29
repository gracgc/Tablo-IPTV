import React from 'react'
import c from './TeamInfo.module.css'
import TeamGamers from "./TeamGamers";
import {addNewLog} from "../../../../redux/log_reducer";
import {useDispatch} from "react-redux";
import * as axios from "axios";


const TeamInfo = (props) => {

    const dispatch = useDispatch();

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
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - Start timeout for ${props.name}`));
    };

    let setTimeout = () => {
        putTimeoutStatus(props.gameNumber, false, 0, 0, 30000, 30000);
        dispatch(addNewLog(props.gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - Set timeout for ${props.name}`));
    };

    let clearTimeout = () => {
        putTimeoutStatus(props.gameNumber, false, 0, 0, 0, 0);
    };

    return (
        <div className={c.team}>
            <div className={c.teamInfo}>
                Team Name: {props.name} <br/>
                Points: {props.teamCounter} <br/>
                TimeOut: {!props.isRunningServer
                    ? <span><span className={c.timeout} onClick={(e) => setTimeout()}>
                Set
            </span> <span className={c.timeout} onClick={(e) => startTimeout()}>
                Start
            </span> <span className={c.timeout} onClick={(e) => clearTimeout()}>
                    Clear
                    </span> <br/></span>
                    : <span><span className={c.timeoutDis}>
                    Set
                    </span> <span className={c.timeoutDis}>
                    Start
                    </span> <span className={c.timeout} onClick={(e) => clearTimeout()}>
                    Clear
                    </span> <br/></span>}

                <div className={c.tableInfo}>
                    <div>
                        <strong>Gamers:</strong>
                    </div>
                    <div>
                        On Field
                    </div>
                </div>
            </div>
            <div className={c.teamGamers}>
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
