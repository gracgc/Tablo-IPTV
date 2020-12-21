import React, {useEffect, useState} from "react";
import c from './CustomGame.module.css'
import c1920 from './CustomGame_1920.module.css'
import {NavLink, withRouter} from "react-router-dom";
import {reduxForm} from "redux-form";
import {compose} from "redux";
import {useSelector} from "react-redux";
import {getGame, setGameDataAC} from "../../../redux/games_reducer";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";
import {getTeams} from "../../../redux/teams_reducer";


const CustomGameForm = (props) => {

    let width = window.innerWidth;

    const teams = useSelector(
        state => state.teamsPage.teams
    );


    let [period, setPeriod] = useState();

    const periods = [1, 2, 3, 4]

    const homeTeamGamers = teams.find(t => t.teamType === 'home').gamers;

    const guestsTeamGamers = teams.find(t => t.teamType === 'guests').gamers;

    useEffect(() => {
        dispatch(getTeams(props.gameNumber));
    }, []);

    const choosePediod = (period) => {
        setPeriod(period)
    }


    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.customGameForm}>
                    <div className={c.customTime}>
                        <div className={c.periodPanel}>
                            <div className={c.panelName}>Периоды</div>
                            {periods.map(p => <span className={period === p ? c.choosenPeriod :c.periods} onClick={(e) => choosePediod(p)}>{p}</span>)}
                        </div>
                        <div className={c.timePanel}>

                        </div>
                    </div>
                    <div className={c.customGamers}>
                        <div className={c.teamPanel}>

                        </div>
                        <div className={c.teamPanel}>

                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
};

const CustomGameReduxForm = reduxForm({form: 'customGame'})(CustomGameForm);


const CustomGame = (props) => {

    let width = window.innerWidth;

    let gameNumber = props.match.params.gameNumber;

    const onSubmit = (formData) => {

    };


    return (
        <div className={c.customGame}>
            <div className={c.menuTitle}>Задайте свои параметры</div>
            <div className={width === 1920 ? c1920.customGamePanel : c.customGamePanel}>
                <CustomGameReduxForm onSubmit={onSubmit}
                                     gameNumber={gameNumber}
                />
            </div>

            <NavLink to={`/adminPanel/${gameNumber}`}>
                <div className={width === 1920 ? c1920.navBackButton : c.navBackButton}>
                    Назад
                </div>
            </NavLink>
        </div>
    )
};

export default compose(withRouter)(CustomGame);
