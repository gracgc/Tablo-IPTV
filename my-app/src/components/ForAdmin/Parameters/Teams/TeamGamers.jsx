import React, {useState} from 'react'
import c from './TeamGamers.module.css'
import {useDispatch} from "react-redux";
import {changeGamerStatus, changeGamerStatusAC, gamerGoal} from "../../../../redux/teams_reducer";
import {addNewLog} from "../../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";


const TeamGamers = (props) => {

    let gameNumber = props.match.params.gameNumber;


    const dispatch = useDispatch();

    const [isGamerGoalEdit, setIsGamerGoalEdit] = useState(false);

    const changeStatus = (gameNumber, teamType, gamerId, gamerStatus) => {
        dispatch(changeGamerStatus(gameNumber, teamType, gamerId, gamerStatus));
        if (props.status === 'in game') {
            dispatch(addNewLog(gameNumber,`Timecode: ${props.fullName} deleted`))
        } if (props.status === 'deleted') {
            dispatch(addNewLog(gameNumber,`Timecode: ${props.fullName} returns to a game`))
        }

    };


    const addGamerGoal = (gameNumber, teamType, id, symbol) => {
        dispatch(gamerGoal(gameNumber, teamType, id, symbol));
        if (symbol === '+') {
            dispatch(addNewLog(gameNumber,`Timecode: ${props.fullName} gets point`))
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
            <div style={{cursor: 'pointer'}} onClick={(e) => {
                changeStatus(gameNumber, props.teamType, props.number, props.status)
            }}>
                {props.status}
            </div>
            <div style={{display: 'inline-flex'}}>
                <div style={{cursor: 'pointer'}} onClick={(e) => gamerGoalEdit()}>
                    {props.goals}
                </div>

                {isGamerGoalEdit ?
                    <div style={{display: 'inline-flex'}}>
                        <button className={c.goalButton}
                                onClick={(e) => {
                                    addGamerGoal(gameNumber, props.teamType, props.number, '+')
                                }}>
                            +1
                        </button>
                        <button className={c.goalButton}
                                onClick={(e) => {
                                    addGamerGoal(gameNumber, props.teamType, props.number, '-')
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
