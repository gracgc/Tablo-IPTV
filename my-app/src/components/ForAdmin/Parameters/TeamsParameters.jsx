import React, {useEffect, useMemo, useState} from 'react'
import c from './TeamsParameters.module.css'
import {useDispatch, useSelector} from "react-redux";
import TeamInfo from "./Teams/TeamInfo";
import {getTeams} from "../../../redux/teams_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";



const TeamsParameters = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getTeams(gameNumber));
    }, [teams]);

    const homeTeamGamers = teams.find(t => t.teamType == 'home').gamers;

    const guestsTeamGamers = teams.find(t => t.teamType == 'guests').gamers;

    const homeTeamInfo = teams.find(t => t.teamType == 'home');

    const guestsTeamInfo = teams.find(t => t.teamType == 'guests');



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

export default compose(withRouter)(TeamsParameters);
