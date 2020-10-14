import React, {useEffect} from 'react'
import c from './TeamsParameters.module.css'
import {useDispatch, useSelector} from "react-redux";
import TeamInfo from "./Teams/TeamInfo";



const TeamsParameters = (props) => {

    const dispatch = useDispatch();



    const homeTeamGamers = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType == 'home').gamers
    );
    const guestsTeamGamers = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType == 'guests').gamers
    );

    const homeTeamInfo = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType == 'home')
    );

    const guestsTeamInfo = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType == 'guests')
    );

    return (
        <div className={c.parameters}>
            <div>
                <TeamInfo teamGamers={homeTeamGamers} teamCounter={homeTeamInfo.counter}
                          name={homeTeamInfo.name} timeOut={homeTeamInfo.timeOut} teamType={homeTeamInfo.teamType}/>
            </div>
            <div>
                <TeamInfo teamGamers={guestsTeamGamers} teamCounter={guestsTeamInfo.counter}
                          name={guestsTeamInfo.name} timeOut={guestsTeamInfo.timeOut} teamType={guestsTeamInfo.teamType}/>
            </div>
        </div>

    )
};

export default TeamsParameters;
