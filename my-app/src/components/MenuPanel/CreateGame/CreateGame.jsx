import React, {useEffect} from "react";
import c from './CreateGame.module.css'
import {NavLink} from "react-router-dom";
import {Field, reduxForm} from "redux-form";
import {Input, InputReadOnly} from "../../../common/FormsControls/FormsControls";
import {required} from "../../../utils/validators";
import {useDispatch, useSelector} from "react-redux";
import {createNewGame, getSavedGames} from "../../../redux/games_reducer";

const CreateGameForm = (props) => {
    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.createForm}>
                    <div className={c.createGameInputPanel}>
                        <div className={c.createGameInput}>
                            Game Name
                            <Field placeholder={'GameName'} name={'gameName'}
                                   validate={[required]}
                                   component={Input}/>
                        </div>
                        <div className={c.createGameInput}>
                            Game Type
                            <Field placeholder={'GameType'} name={'gameType'}
                                   validate={[required]}
                                   component={Input}/>
                        </div>
                    </div>
                    <div className={c.createTeamsInputPanel}>
                        <div>
                            <div className={c.homeTeam}>
                                Home Team Name
                                <Field placeholder={'HomeTeamName'} name={'HomeTeamName'}
                                       validate={[required]}
                                       component={Input}/>
                            </div>
                        </div>
                        <div className={c.guestsTeam}>
                            <div className={c.homeTeam}>
                                Guests Team Name
                                <Field placeholder={'GuestsTeamName'} name={'guestsTeamName'}
                                       validate={[required]}
                                       component={Input}/>
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

    useEffect( () => {
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
