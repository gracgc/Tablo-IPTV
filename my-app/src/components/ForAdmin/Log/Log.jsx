import React, {useEffect, useRef, useState} from 'react'
import c from './Log.module.css'
import c1920 from './Log_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import LogItem from "./LogItem";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Field, reduxForm} from "redux-form";
import {Input} from "../../../common/FormsControls/FormsControls";
import {addNewLog, getLog, setLogDataAC} from "../../../redux/log_reducer";
import {reset} from 'redux-form';
import socket from "../../../socket/socket";


const AddLogForm = (props) => {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.logForm}>
                    <Field placeholder={'Добавить лог'} name={'addLog'}
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

    let width = window.innerWidth;

    const gameLog = useSelector(
        state => state.logPage.logData.gameLog
    );

    const logEndRef = useRef(null)

    const scrollToBottom = () => {
        logEndRef.current.scrollIntoView({ behavior: "auto" })
    }

    useEffect(scrollToBottom, [gameLog]);


    const onSubmit = (formData) => {
        if (formData.addLog !== undefined) {
            dispatch(addNewLog(gameNumber, formData.addLog));
            dispatch(reset('addLog'))
        }
    };

    useEffect(() => {
        dispatch(getLog(gameNumber));
        socket.on(`getLog${gameNumber}`, log => {
                dispatch(setLogDataAC(log))
            }
        )
    }, []);


    return (
        <div className={width === 1920 ? c1920.log : c.log}>
            <div style={{fontSize: width === 1920 ? "36px" : "24px", marginBottom: "1%"}}>Лог</div>
            <div className={width === 1920 ? c1920.logWindow : c.logWindow}>
                {gameLog.map(l => <LogItem gameNumber={gameNumber} key={l.id} id={l.id} logItem={l.item}/>)}
                <div ref={logEndRef} />
            </div>
            <AddLogReduxForm onSubmit={onSubmit}/>
        </div>
    )
};

export default compose(withRouter)(Log);
