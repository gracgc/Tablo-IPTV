import React from "react";
import c from './CreateGame.module.css'
import {NavLink} from "react-router-dom";
import {Field, reduxForm} from "redux-form";
import {Input} from "../../../common/FormsControls/FormsControls";
import {required} from "../../../utils/validators";
import {useDispatch} from "react-redux";
import {createNewGame} from "../../../redux/games_reducer";

const CreateGameForm = (props) => {
    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.createGameInputPanel}>
                    <div className={c.createGameInput}>
                        <Field placeholder={'GameName'} name={'gameName'}
                               validate={[required]}
                               component={Input}/>
                    </div>
                    <div className={c.createGameInput}>
                        <Field placeholder={'GameNumber'} name={'gameNumber'}
                               validate={[required]}
                               component={Input}/>
                    </div>
                    <div className={c.createGameInput}>
                        <Field placeholder={'GameType'} name={'gameType'}
                               validate={[required]}
                               component={Input}/>
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


    const onSubmit = (formData) => {
        dispatch(createNewGame(formData.gameName, +formData.gameNumber, formData.gameType));
    }
    return (
        <div className={c.createGame}>
            <span className={c.menuTitle}>Create new game</span>
            <div className={c.createGamePanel}>
                <CreateGameReduxForm onSubmit={onSubmit}/>
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
