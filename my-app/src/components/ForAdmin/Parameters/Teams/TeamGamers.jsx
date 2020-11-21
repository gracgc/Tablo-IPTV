import React, {useState} from 'react'
import c from './TeamGamers.module.css'
import {useDispatch, useSelector} from "react-redux";
import {
    changeGamerStatus,
    deleteGamer,
    gamerGoal,
    gamerOnField,
} from "../../../../redux/teams_reducer";
import {addNewConsLog, addNewLog, addNewTempLog, deleteConsLog} from "../../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import GamerMenu from "./GamerMenu";



const TeamGamers = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    let secondsStopwatch = Math.floor(props.timeMem / 1000) % 60;
    let minutesStopwatch = Math.floor(props.timeMem / (1000 * 60)) + (props.period - 1) * 20;

    const consLog = useSelector(
        state => state.logPage.logData.tabloLog.consLog
    );

    const changeStatus = (gameNumber, teamType, gamerId, timeOfPenalty) => {
        dispatch(changeGamerStatus(gameNumber, teamType, gamerId));
        if (props.status === 'in game') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} deleted for ${timeOfPenalty/60000} min`));
            dispatch(addNewConsLog(gameNumber, gamerId, teamType, `${props.fullName} deleted for`));
            dispatch(deleteGamer(gameNumber, teamType, gamerId, timeOfPenalty, props.timeMemTimer));
        }
        if (props.status === 'deleted') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} returns to a game`));
            dispatch(addNewTempLog(gameNumber, `${props.fullName} returns to a game`));
            dispatch(deleteConsLog(gameNumber, consLog.findIndex(c => c.id === props.id && c.teamType === props.teamType)));
        }
    };

    const changeGamerOnField = (gameNumber, teamType, gamerId, onField) => {
        dispatch(gamerOnField(gameNumber, teamType, gamerId, onField));
        if (props.onField === true) {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} goes to the bench`));
            dispatch(addNewTempLog(gameNumber,
                `${props.fullName} goes to the bench`))
        }
        if (props.onField === false) {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} returns on field`));
            dispatch(addNewTempLog(gameNumber,
                `${props.fullName} returns on field`))
        }
    };

    const addGamerGoal = (gameNumber, teamType, id, symbol) => {
        dispatch(gamerGoal(gameNumber, teamType, id, symbol));
        if (symbol === '+') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} gets point`))
        }
    };


    return (
        <div className={c.teamGamers}>
            <div>
                {props.number}
            </div>

            <GamerMenu gameNumber={gameNumber}
                timeMem={props.timeMem}
                       id={props.id}
                       onField={props.onField}
                       fullName={props.fullName}
                       status={props.status} goals={props.goals}
                       teamType={props.teamType}
                       addGamerGoal={addGamerGoal}
                       changeStatus={changeStatus}/>
            <div style={{paddingLeft: "5%"}}>
                {props.status}
            </div>

            <div style={{cursor: 'pointer'}} onClick={(e) => {
                changeGamerOnField(gameNumber, props.teamType, props.id, props.onField)
            }}>
                {props.onField ? '✓' : '✘'}
            </div>

            <div style={{display: 'inline-flex'}}>
                {props.goals}
            </div>
        </div>
    )
};


export default compose(withRouter)(TeamGamers);
