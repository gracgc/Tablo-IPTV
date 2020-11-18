import React, {useState} from 'react'
import c from './Log.module.css'
import {useDispatch, useSelector} from "react-redux";
import LogItem from "./LogItem";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Field, reduxForm} from "redux-form";
import {Input} from "../../../common/FormsControls/FormsControls";
import {addNewLog} from "../../../redux/log_reducer";
import {reset} from 'redux-form';


const AddLogForm = (props) => {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.logForm}>
                    <Field placeholder={'Add log'} name={'addLog'}
                           component={Input}/>
                    <button className={c.addLogButton}>
                        +
                    </button>
                </div>
            </form>
        </div>
    )
};

const AddLogReduxForm = reduxForm({form: 'addLog'})(AddLogForm);


const Log = (props) => {

    const dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const gameLog = useSelector(
        state => state.logPage.logData.gameLog
    );

    const onSubmit = (formData) => {
        if (formData.addLog != undefined) {
            dispatch(addNewLog(gameNumber, formData.addLog));
            dispatch(reset('addLog'))
        }
    };

    return (
        <div className={c.log}>
            <div style={{fontSize: "150%", marginBottom: "1%"}}>Log</div>
            <div className={c.logWindow}>
                {gameLog.map(l => <LogItem gameNumber={gameNumber} key={l.id} id={l.id} logItem={l.item}/>)}
            </div>
                <AddLogReduxForm onSubmit={onSubmit}/>
        </div>
    )
};

export default compose(withRouter)(Log);
