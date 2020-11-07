import React, {useEffect, useMemo, useState} from 'react'
import c from './TeamsParameters.module.css'
import {useDispatch, useSelector} from "react-redux";
import TeamInfo from "./Teams/TeamInfo";
import {getTeams} from "../../../redux/teams_reducer";
import {compose} from "redux";
import {NavLink, withRouter} from "react-router-dom";
import * as axios from "axios";


const TeamsParameters = (props) => {

    let gameNumber = props.match.params.gameNumber;

    let [timeMem, setTimeMem] = useState();

    let [period, setPeriod] = useState();

    let [isRunningServer, setIsRunningServer] = useState();

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    const dispatch = useDispatch();

    const getTimerStatus = (gameNumber) => {
        return axios.get(`http://localhost:5000/api/time/${gameNumber}`)
            .then(responce => {
                return responce.data
            });
    };

    useEffect(() => {
            let interval = setInterval(() => {
                dispatch(getTeams(gameNumber));
                getTimerStatus(gameNumber).then(r => {
                        setTimeMem(r.gameTime.timeData.timeMem);
                        setIsRunningServer(r.gameTime.isRunning);
                        setPeriod(r.period)
                    }
                );
            }, 1000);
            return () => clearInterval(interval);
        }
    );

    const homeTeamGamers = teams.find(t => t.teamType == 'home').gamers;

    const guestsTeamGamers = teams.find(t => t.teamType == 'guests').gamers;

    const homeTeamInfo = teams.find(t => t.teamType == 'home');

    const guestsTeamInfo = teams.find(t => t.teamType == 'guests');


    return (
        <div className={c.parameters}>
            <div>
                <TeamInfo period={period} timeMem={timeMem} isRunningServer={isRunningServer}
                          teamGamers={homeTeamGamers} teamCounter={homeTeamInfo.counter}
                          name={homeTeamInfo.name} timeOut={homeTeamInfo.timeOut} teamType={homeTeamInfo.teamType}/>
            </div>
            <div>
                <TeamInfo period={period} timeMem={timeMem} isRunningServer={isRunningServer}
                          teamGamers={guestsTeamGamers} teamCounter={guestsTeamInfo.counter}
                          name={guestsTeamInfo.name} timeOut={guestsTeamInfo.timeOut}
                          teamType={guestsTeamInfo.teamType}/>
            </div>
            <NavLink to="/">
                <div className={c.navBackButton}>
                    Back to menu
                </div>
            </NavLink>
        </div>

    )
};

export default compose(withRouter)(TeamsParameters);
