import React from 'react'
import c from './TeamInfo.module.css'
import TeamGamers from "./TeamGamers";


const TeamInfo = (props) => {



    return (
        <div className={c.team}>
            <div className={c.teamInfo}>
                Team Name: {props.name} <br/>
                Points: {props.teamCounter} <br/>
                TimeOut: {props.timeOut} <br/>
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
