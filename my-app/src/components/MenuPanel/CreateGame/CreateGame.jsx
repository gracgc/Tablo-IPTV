import React, {useEffect, useState} from "react";
import c from './CreateGame.module.css'
import c1920 from './CreateGame_1920.module.css'
import {NavLink} from "react-router-dom";
import {Field, reduxForm, change} from "redux-form";
import {Input, InputReadOnly} from "../../../common/FormsControls/FormsControls";
import {required, requiredShort} from "../../../utils/validators";
import {useDispatch, useSelector} from "react-redux";
import {createNewGame, getSavedGames} from "../../../redux/games_reducer";


const CreateGameForm = (props) => {

    let width = window.innerWidth;

    let [menuIsOpen, setMenuIsOpen] = useState(false);

    let addPlayer = (team, setTeam) => {
        let newArray = [...team, (team[team.length - 1]) + 1];
        setTeam(newArray)
    };

    let deletePlayer = async (team, setTeam) => {
        let newArray = [...team];
        if (newArray.length > 6) {
            await newArray.pop();
            setTeam(newArray)
        }
    };

    let openGameTypeMenu = () => {
        if (menuIsOpen === false) {
            setMenuIsOpen(true)
        } else {
            setMenuIsOpen(false)
        }
    };

    let chooseGame = async (value) => {
        await props.dispatch(change('createGame', 'gameType', value));
        setMenuIsOpen(false);
    };

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={width === 1920 ? c1920.createForm : c.createForm}>
                    <div className={width === 1920 ? c1920.createGameInputPanel : c.createGameInputPanel}>
                        <div className={width === 1920 ? c1920.createGameInput : c.createGameInput}>
                            <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Название игры</div>
                            <Field placeholder={'Название игры'} name={'gameName'}
                                   validate={[required]}
                                   component={Input}/>
                        </div>
                        <div className={width === 1920 ? c1920.createGameInput : c.createGameInput}>
                            <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Тип игры</div>

                            <Field placeholder={'Выбирете тип игры'} name={'gameType'}
                                   validate={[required]}
                                   component={InputReadOnly}/>
                            <div style={{cursor: "pointer"}} onClick={(e) => openGameTypeMenu()}>
                                <strong style={{fontSize: '125%'}}>Выбрать игру ▼</strong>
                                {menuIsOpen && props.gameTypes.map(g =>
                                    <div className={width === 1920 ? c1920.gameTypeMenu : c.gameTypeMenu} onClick={(e) => {
                                        chooseGame(g)
                                    }}>
                                        {g}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className={width === 1920 ? c1920.createTeamsInputPanel : c.createTeamsInputPanel}>
                        <div>
                            <div className={width === 1920 ? c1920.homeTeam : c.homeTeam}>
                                <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Название команды</div>
                                <Field placeholder={'Название команды'} name={'homeTeamName'}
                                       validate={[required]}
                                       component={Input}/>
                            </div>
                            <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Игроки</div>
                            <div className={width === 1920 ? c1920.homeGamers : c.homeGamers}>
                                {props.numberOfHomePlayers.map(n => <div className={width === 1920 ? c1920.homeGamer : c.homeGamer}>
                                    <Field placeholder={(n <= 6) ? `Игрок ${n} (На поле)` :
                                    (n > 6) && `Игрок ${n} (в резерве)`} name={`homeGamer${n}`}
                                           validate={[required]}
                                           component={Input}/>
                                    <Field placeholder={`№`} name={`homeNumber${n}`}
                                           validate={[requiredShort]}
                                           component={Input}/>
                                </div>)}
                                <div className={width === 1920 ? c1920.addDeleteGamerButtons : c.addDeleteGamerButtons}>
                                    <div className={width === 1920 ? c1920.addGamerButton : c.addGamerButton}
                                         onClick={(e) =>
                                             addPlayer(props.numberOfHomePlayers, props.setNumberOfHomePlayers)}>
                                        +
                                    </div>
                                    <div className={width === 1920 ? c1920.deleteGamerButton : c.deleteGamerButton}
                                         onClick={(e) =>
                                             deletePlayer(props.numberOfHomePlayers, props.setNumberOfHomePlayers)}>
                                        -
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={width === 1920 ? c1920.guestsTeam : c.guestsTeam}>
                            <div className={width === 1920 ? c1920.homeTeam : c.homeTeam}>
                                <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Название команды</div>
                                <Field placeholder={'Название команды'} name={'guestsTeamName'}
                                       validate={[required]}
                                       component={Input}/>
                            </div>
                            <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Игроки</div>
                            <div className={width === 1920 ? c1920.homeGamers : c.homeGamers}>
                                {props.numberOfGuestsPlayers.map(n => <div className={width === 1920 ? c1920.homeGamer : c.homeGamer}>
                                    <Field placeholder={(n <= 6) ? `Игрок ${n} (На поле)` :
                                    (n > 6) && `Игрок ${n} (В резерве)`} name={`guestsGamer${n}`}
                                           validate={[required]}
                                           component={Input}/>
                                    <Field placeholder={`№`} name={`guestsNumber${n}`}
                                           validate={[requiredShort]}
                                           component={Input}/>
                                </div>)}
                                <div className={width === 1920 ? c1920.addDeleteGamerButtons : c.addDeleteGamerButtons}>
                                    <div className={width === 1920 ? c1920.addGamerButton : c.addGamerButton}
                                         onClick={(e) =>
                                             addPlayer(props.numberOfGuestsPlayers, props.setNumberOfGuestsPlayers)}>
                                        +
                                    </div>
                                    <div className={width === 1920 ? c1920.deleteGamerButton : c.deleteGamerButton}
                                         onClick={(e) =>
                                             deletePlayer(props.numberOfGuestsPlayers, props.setNumberOfGuestsPlayers)}>
                                        -
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={width === 1920 ? c1920.createGameInput : c.createGameInput}>
                    <button className={width === 1920 ? c1920.createGameButton : c.createGameButton}>Create new game</button>
                </div>
            </form>
        </div>
    )
};

const CreateGameReduxForm = reduxForm({form: 'createGame'})(CreateGameForm);


const CreateGame = (props) => {

    let width = window.innerWidth;

    let [numberOfHomePlayers, setNumberOfHomePlayers] = useState([1, 2, 3, 4, 5, 6]);
    let [numberOfGuestsPlayers, setNumberOfGuestsPlayers] = useState([1, 2, 3, 4, 5, 6]);

    let gameTypes = ['Классический хоккей'];

    let [successMessage, setSuccessMessage] = useState(false);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSavedGames());
    }, []);

    let lastGameNumber = useSelector(
        state => state.gamesPage.savedGames[state.gamesPage.savedGames.length - 1].gameNumber
    );


    const onSubmit = (formData) => {
        dispatch(createNewGame(formData.gameName, lastGameNumber + 1, formData.gameType,
            formData.homeTeamName,
            numberOfHomePlayers.map(n => ({
                id: n,
                fullName: eval(`formData.homeGamer${n}`),
                gamerNumber: eval(`formData.homeNumber${n}`),
                status: "in game",
                onField: (n <= 6) ? true : (n > 6) && false,
                goals: 0,
                timeOfPenalty: 0,
                whenWasPenalty: 0
            })),
            formData.guestsTeamName,
            numberOfGuestsPlayers.map(n => ({
                id: n,
                fullName: eval(`formData.guestsGamer${n}`),
                gamerNumber: eval(`formData.guestsNumber${n}`),
                status: "in game",
                onField: (n <= 6) && true ? (n > 6) : false,
                goals: 0,
                timeOfPenalty: 0,
                whenWasPenalty: 0
            }))
        ));
        setSuccessMessage(true);

    };


    if (successMessage) {
        return <div className={c.createGame}>
            <div className={c.successMessage}>
                Игра успешно создана!
            </div>
            <NavLink to="/">
                <div className={width === 1920 ? c1920.navBackButton : c.navBackButton}>
                    Вернуться в меню
                </div>
            </NavLink>
        </div>
    }

    return (
        <div className={c.createGame}>

            <span className={width === 1920 ? c1920.menuTitle : c.menuTitle}>Create new game</span>
            <div className={width === 1920 ? c1920.createGamePanel : c.createGamePanel}>
                <CreateGameReduxForm onSubmit={onSubmit}
                                     gameTypes={gameTypes}
                                     numberOfHomePlayers={numberOfHomePlayers}
                                     setNumberOfHomePlayers={setNumberOfHomePlayers}
                                     numberOfGuestsPlayers={numberOfGuestsPlayers}
                                     setNumberOfGuestsPlayers={setNumberOfGuestsPlayers}
                />
            </div>
            <NavLink to="/">
                <div className={width === 1920 ? c1920.navBackButton : c.navBackButton}>
                    Вернуться в меню
                </div>
            </NavLink>
        </div>
    )
};

export default CreateGame;
