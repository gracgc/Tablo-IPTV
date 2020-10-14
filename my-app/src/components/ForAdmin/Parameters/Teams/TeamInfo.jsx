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
                <strong>Gamers:</strong>
            </div>
            <div className={c.teamGamers}>
                {props.teamGamers.map(htg => <TeamGamers key={htg.id} number={htg.id} fullName={htg.fullName}
                                                         status={htg.status} goals={htg.goals}
                                                         teamType={props.teamType}/>)}
            </div>
        </div>

    )
};

export default TeamInfo;
