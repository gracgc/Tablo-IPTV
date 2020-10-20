import React, {useEffect, useState} from "react";
import c from './CreateGame.module.css'
import {NavLink} from "react-router-dom";
import {Field, reduxForm} from "redux-form";
import {Input, InputReadOnly} from "../../../common/FormsControls/FormsControls";
import {required} from "../../../utils/validators";
import {useDispatch, useSelector} from "react-redux";
import {createNewGame, getSavedGames} from "../../../redux/games_reducer";

const CreateGameForm = (props) => {

    let [numberOfHomePlayers, setNumberOfHomePlayers] = useState([1, 2, 3, 4, 5, 6]);
    let [numberOfGuestsPlayers, setNumberOfGuestsPlayers] = useState([1, 2, 3, 4, 5, 6]);

    let addPlayer = (team, setTeam) => {
        let a = [...team, (team[team.length - 1]) + 1];
        setTeam(a)
    };

    let deletePlayer = async (team, setTeam) => {
        let a = [...team];
        if (a.length > 6) {
            await a.pop();
            setTeam(a)
        }
    };

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.createForm}>
                    <div className={c.createGameInputPanel}>
                        <div className={c.createGameInput}>
                            Game Name
                            <Field placeholder={'Game Name'} name={'gameName'}
                                   validate={[required]}
                                   component={Input}/>
                        </div>
                        <div className={c.createGameInput}>
                            Game Type
                            <Field placeholder={'Game Type'} name={'gameType'}
                                   validate={[required]}
                                   component={Input}/>
                        </div>
                    </div>
                    <div className={c.createTeamsInputPanel}>
                        <div>
                            <div className={c.homeTeam}>
                                Home Team Name
                                <Field placeholder={'Home Team Name'} name={'homeTeamName'}
                                       validate={[required]}
                                       component={Input}/>
                            </div>
                            Gamers
                            <div className={c.homeGamers}>
                                {numberOfHomePlayers.map(n => <div>
                                    <Field placeholder={`Home Gamer ${n}`} name={`homeGamer${n}`}
                                           validate={[required]}
                                           component={Input}/>
                                </div>)}
                                <div className={c.addDeleteGamerButtons}>
                                    <div className={c.addGamerButton}
                                         onClick={(e) => addPlayer(numberOfHomePlayers, setNumberOfHomePlayers)}>
                                        +
                                    </div>
                                    <div className={c.deleteGamerButton}
                                         onClick={(e) => deletePlayer(numberOfHomePlayers, setNumberOfHomePlayers)}>
                                        -
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={c.guestsTeam}>
                            <div className={c.homeTeam}>
                                Guests Team Name
                                <Field placeholder={'Guests Team Name'} name={'guestsTeamName'}
                                       validate={[required]}
                                       component={Input}/>
                            </div>
                            Gamers
                            <div className={c.homeGamers}>
                                {numberOfGuestsPlayers.map(n => <div>
                                    <Field placeholder={`Guests Gamer ${n}`} name={`guestsGamer${n}`}
                                           validate={[required]}
                                           component={Input}/>
                                </div>)}
                                <div className={c.addDeleteGamerButtons}>
                                    <div className={c.addGamerButton}
                                         onClick={(e) => addPlayer(numberOfGuestsPlayers, setNumberOfGuestsPlayers)}>
                                        +
                                    </div>
                                    <div className={c.deleteGamerButton}
                                         onClick={(e) => deletePlayer(numberOfGuestsPlayers, setNumberOfGuestsPlayers)}>
                                        -
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={c.createGameInput}>
                    <button className={c.createGameButton}>Create new game</button>
                </div>
            </form>
        </div>
    )
};

const CreateGameReduxForm = reduxForm({form: 'createGame'})(CreateGameForm);


const CreateGame = (props) => {

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSavedGames());
    }, []);

    let lastGameNumber = useSelector(
        state => state.gamesPage.savedGames[state.gamesPage.savedGames.length - 1].gameNumber
    );


    const onSubmit = (formData) => {
        dispatch(createNewGame(formData.gameName, lastGameNumber + 1, formData.gameType));
    };

    return (
        <div className={c.createGame}>

            <span className={c.menuTitle}>Create new game</span>
            <div className={c.createGamePanel}>
                <CreateGameReduxForm onSubmit={onSubmit}
                                     initialValues={{gameNumber: 3}}/>
            </div>
            <NavLink to="/">
                <div className={c.navBackButton}>
                    Back to menu
                </div>
            </NavLink>
        </div>
    )
};

export default CreateGame;
