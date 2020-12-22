import React, {useEffect, useState} from "react";
import c from './CustomGame.module.css'
import c1920 from './CustomGame_1920.module.css'
import {NavLink, withRouter} from "react-router-dom";
import {change, Field, reduxForm} from "redux-form";
import {compose} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {getTeams} from "../../../redux/teams_reducer";
import {Input} from "../../../common/FormsControls/FormsControls";
import {tabloAPI} from "../../../api/api";
import {customGame} from "../../../redux/games_reducer";


const CustomGameForm = (props) => {

    let width = window.innerWidth;

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    let dispatch = useDispatch();


    let [period, setPeriod] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();

    const periods = [1, 2, 3, 4]

    const homeTeam = teams.find(t => t.teamType === 'home');

    const guestsTeam = teams.find(t => t.teamType === 'guests');

    const homeTeamGamers = homeTeam.gamers;

    const guestsTeamGamers = guestsTeam.gamers;

    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));

    useEffect(() => {
        dispatch(getTeams(props.gameNumber));
        homeTeamGamers.map(g => {
                props.dispatch(change('customGame', `homeGamerName${g.id}`, g.fullName))
                props.dispatch(change('customGame', `homeGamerNumber${g.id}`, g.gamerNumber))
            }
        )
        guestsTeamGamers.map(g => {
                props.dispatch(change('customGame', `guestsGamerName${g.id}`, g.fullName))
                props.dispatch(change('customGame', `guestsGamerNumber${g.id}`, g.gamerNumber))
            }
        )
        props.dispatch(change('customGame', `homeName`, homeTeam.name))
        props.dispatch(change('customGame', `guestsName`, guestsTeam.name))
    }, [homeTeamGamers.length]);

    useEffect(() => {
        tabloAPI.getTimerStatus(props.gameNumber, Date.now()).then(r => {
            setTimeMemTimer(r.timeData.timeMemTimer);
            setPeriod(r.period)
        })
        props.dispatch(change('customGame', 'min', minutesTimer));
        props.dispatch(change('customGame', 'sec', secondsTimer));
    }, [timeMemTimer]);

    const choosePeriod = (period) => {
        setPeriod(period)
        props.dispatch(change('customGame', 'period', period));
    }


    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.customGameForm}>
                    <div style={{display: "none"}}>
                        <Field placeholder={'мин'} name={'period'}
                               component={Input}/>
                    </div>
                    <div className={c.customTime}>
                        <div className={c.periodPanel}>
                            <div className={c.panelName}>Периоды</div>
                            {periods.map(p => <span className={period === p ? c.choosenPeriod : c.periods}
                                                    onClick={(e) => choosePeriod(p)}>{p > 3 ? 'Овертайм' : p}</span>)}
                        </div>
                        <div className={c.timePanel}>
                            <div className={c.panelName}>Время таймера</div>
                            <div style={{display: "inline-flex"}}>
                                <Field placeholder={'мин'} name={'min'}
                                       component={Input}/>
                                <Field placeholder={'сек'} name={'sec'}
                                       component={Input}/>
                            </div>
                        </div>
                    </div>
                    <div className={c.customGamers}>
                        <div className={c.teamPanel}>
                            <Field placeholder={'название команды'} name={`homeName`}
                                   component={Input}/>
                            <div className={c.panelName}>Игроки</div>
                            {homeTeamGamers.map(g => <div className={c.team}>
                                <div>
                                    <Field placeholder={'имя игрока'} name={`homeGamerName${g.id}`}
                                           component={Input}/>
                                </div>
                                <div>
                                    <Field placeholder={'№'} name={`homeGamerNumber${g.id}`}
                                           component={Input}/>
                                </div>
                            </div>)}
                        </div>
                        <div className={c.teamPanel}>
                            <Field placeholder={'название команды'} name={`guestsName`}
                                   component={Input}/>
                            <div className={c.panelName}>Игроки</div>
                            {guestsTeamGamers.map(g => <div className={c.team}>
                                <div>
                                    <Field placeholder={'имя игрока'} name={`guestsGamerName${g.id}`}
                                           component={Input}/>
                                </div>
                                <div>
                                    <Field placeholder={'№'} name={`guestsGamerNumber${g.id}`}
                                           component={Input}/>
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
                <div>
                    <button className={c.customGameButton}>Сохранить изменения</button>
                </div>
            </form>
        </div>
    )
};

const CustomGameReduxForm = reduxForm({form: 'customGame'})(CustomGameForm);


const CustomGame = (props) => {

    let width = window.innerWidth;

    let dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    const homeTeamGamers = teams.find(t => t.teamType === 'home').gamers;

    const guestsTeamGamers = teams.find(t => t.teamType === 'guests').gamers;



    const onSubmit = (formData) => {
        dispatch(customGame(gameNumber, formData.period, (formData.min*60000 + formData.sec*1000), formData.homeName,
            homeTeamGamers.map(g => ({id: g.id, fullName: eval(`formData.homeGamerName${g.id}`), gamerNumber: eval(`formData.homeGamerNumber${g.id}`) })),
            formData.guestsName,
            guestsTeamGamers.map(g => ({id: g.id, fullName: eval(`formData.guestsGamerName${g.id}`), gamerNumber: eval(`formData.guestsGamerNumber${g.id}`) }))
            ))
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