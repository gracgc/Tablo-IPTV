import React, {useState} from 'react'
import c from './TeamGamers.module.css'
import {useDispatch} from "react-redux";
import {changeGamerStatus, gamerGoal, gamerOnField} from "../../../../redux/teams_reducer";
import {addNewLog} from "../../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";


const TeamGamers = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const [isGamerGoalEdit, setIsGamerGoalEdit] = useState(false);


    let secondsStopwatch = Math.floor(props.timeMem / 1000) % 60;
    let minutesStopwatch = Math.floor(props.timeMem / (1000 * 60));




    const changeStatus = (gameNumber, teamType, gamerId, gamerStatus) => {
        dispatch(changeGamerStatus(gameNumber, teamType, gamerId, gamerStatus));
        if (props.status === 'in game') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} deleted`))
        }
        if (props.status === 'deleted') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} returns to a game`))
        }
    };

    const changeGamerOnField = (gameNumber, teamType, gamerId, onField) => {
        dispatch(gamerOnField(gameNumber, teamType, gamerId, onField));
        if (props.onField === true) {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} goes to the bench`))
        }
        if (props.onField === false) {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} returns on field`))
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
            {!props.isRunningServer
                ? <div style={{cursor: 'pointer'}} onClick={(e) => {
                    changeStatus(gameNumber, props.teamType, props.id, props.status)
                }}>
                    {props.status}
                </div>
                : <div style={{cursor: 'wait'}}>
                    {props.status}
                </div>
            }
            {!props.isRunningServer
                ? <div style={{cursor: 'pointer'}} onClick={(e) => {
                    changeGamerOnField(gameNumber, props.teamType, props.id, props.onField)
                }}>
                    {props.onField && '✓' || '✘'}
                </div>
                : <div style={{cursor: 'wait'}}>
                    {props.onField && '✓' || '✘'}
                </div>
            }


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
