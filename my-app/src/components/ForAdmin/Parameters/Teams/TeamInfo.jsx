import React from 'react'
import c from './TeamInfo.module.css'
import TeamGamers from "./TeamGamers";
import * as axios from "axios";
import {addNewLog} from "../../../../redux/log_reducer";
import {useDispatch} from "react-redux";


const TeamInfo = (props) => {

    const dispatch = useDispatch();

    const putTimeoutStatus = (gameNumber, isRunning, currentLocalTime, timeDif,
                              timeMem, timeMemTimer, deadLine) => {
        return axios.put(`http://localhost:5000/api/time/isRunningTimeout/${gameNumber}`, {
            isRunning,
            currentLocalTime,
            timeDif,
            timeMem,
            timeMemTimer,
            deadLine
        })
    };

    let startTimeout = () => {
        putTimeoutStatus(props.gameNumber, true, Date.now(), 0, 0, 30000, 30000);
        dispatch(addNewLog(props.gameNumber,
            `Start timeout for ${props.name}`));
    };

    let stopTimeout = () => {
        putTimeoutStatus(props.gameNumber, false, Date.now(), 0, 0, 30000, 30000);
        dispatch(addNewLog(props.gameNumber,
            `Start timeout for ${props.name}`));
    };

    return (
        <div className={c.team}>
            <div className={c.teamInfo}>
                Team Name: {props.name} <br/>
                Points: {props.teamCounter} <br/>
                TimeOut: <div onClick={(e) => startTimeout()}>GET</div><div onClick={(e) => stopTimeout()}>STOP</div> <br/>
                <div className={c.tableInfo} >
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
