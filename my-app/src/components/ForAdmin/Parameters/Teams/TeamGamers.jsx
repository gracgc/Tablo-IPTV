import React, {useEffect, useState} from 'react'
import c from './TeamGamers.module.css'
import {useDispatch, useSelector} from "react-redux";
import {
    changeGamerStatus,
    deleteGamer,
    gamerGoal,
    gamerOnField, setTimeOfPenaltyAC
} from "../../../../redux/teams_reducer";
import {addNewConsLog, addNewLog, addNewTempLog, deleteConsLog} from "../../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";


const TeamGamers = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const [isGamerGoalEdit, setIsGamerGoalEdit] = useState(false);

    const [showHelper, setShowHelper] = useState(false);

    let secondsStopwatch = Math.floor(props.timeMem / 1000) % 60;
    let minutesStopwatch = Math.floor(props.timeMem / (1000 * 60)) + (props.period - 1) * 20;

    const consLog = useSelector(
        state => state.logPage.logData.tabloLog.consLog
    );

    const timeOfPenalty = useSelector(
        state => state.teamsPage.timeOfPenalty
    );


    const changeStatus = (gameNumber, teamType, gamerId) => {
        dispatch(changeGamerStatus(gameNumber, teamType, gamerId));
        if (props.status === 'in game') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} deleted for `));
            dispatch(addNewConsLog(gameNumber, gamerId, teamType, `${props.fullName} deleted for `));
            dispatch(deleteGamer(gameNumber, teamType, gamerId, timeOfPenalty, props.timeMemTimer));
            dispatch(setTimeOfPenaltyAC(0))
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

    const gamerGoalEdit = () => {
        if (isGamerGoalEdit === false) {
            setIsGamerGoalEdit(true)
        } else {
            setIsGamerGoalEdit(false)
        }
    };


    return (
        <div className={c.teamGamers}>
            <div>
                {props.number}
            </div>
            <div>
                {props.fullName}
            </div>
            {timeOfPenalty === 0 && props.status === 'in game'
                ? <div style={{cursor: 'help'}} onMouseOver={(e) => {
                    setShowHelper(true)
                }} onMouseLeave={(e) => {
                    setShowHelper(false)
                }}>
                    {showHelper && <span className={c.timeOfPenalty}>Chose Time Of Penalty</span>}
                    {props.status}
                </div>
                : <div style={{cursor: 'pointer'}} onClick={(e) => {
                    changeStatus(gameNumber, props.teamType, props.id)
                }}>
                    {props.status}
                </div>
            }


            <div style={{cursor: 'pointer'}} onClick={(e) => {
                changeGamerOnField(gameNumber, props.teamType, props.id, props.onField)
            }}>
                {props.onField ? '✓' : '✘'}
            </div>

            <div style={{display: 'inline-flex'}}>
                <div style={{cursor: 'pointer'}} onClick={(e) => gamerGoalEdit()}>
                    {props.goals}
                </div>
                {isGamerGoalEdit ?
                    <div style={{display: 'inline-flex'}}>
                        <button className={c.goalButton}
                                onClick={(e) => {
                                    addGamerGoal(gameNumber, props.teamType, props.id, '+')
                                }}>
                            +1
                        </button>
                        <button className={c.goalButton}
                                onClick={(e) => {
                                    addGamerGoal(gameNumber, props.teamType, props.id, '-')
                                }}>
                            -1
                        </button>
                    </div>
                    : <div></div>}

            </div>
        </div>
    )
};

export default compose(withRouter)(TeamGamers);
