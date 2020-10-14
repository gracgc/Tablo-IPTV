import React, {useState} from 'react'
import c from './TeamGamers.module.css'
import {useDispatch} from "react-redux";
import {addGamerGoalAC, changeGamerStatusAC} from "../../../../redux/teams_reducer";
import {addLogAC} from "../../../../redux/log_reducer";


const TeamGamers = (props) => {

    const dispatch = useDispatch();

    const [isGamerGoalEdit, setIsGamerGoalEdit] = useState(false);

    const changeGamerStatus = (gamerId, teamType) => {
        dispatch(changeGamerStatusAC(gamerId, teamType));
        if (props.status == 'in game') {
            addLog(`Timecode: ${props.fullName} deleted`)
        } if (props.status == 'deleted') {
            addLog(`Timecode: ${props.fullName} returns to a game`)
        }

    };

    const addLog = (logItem) => {
        dispatch(addLogAC(logItem));
    };

    const addGamerGoal = (gamerId, teamType, symbol) => {
        dispatch(addGamerGoalAC(gamerId, teamType, symbol));
        if (symbol === '+') {
            addLog(`Timecode: ${props.fullName} gets point`)
        }
    };

    const gamerGoalEdit = () => {
        if (isGamerGoalEdit == false) {
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
                changeGamerStatus(props.number, props.teamType)
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
                                    addGamerGoal(props.number, props.teamType, '+')
                                }}>
                            +1
                        </button>
                        <button className={c.goalButton}
                                onClick={(e) => {
                                    addGamerGoal(props.number, props.teamType, '-')
                                }}>
                            -1
                        </button>
                    </div>
                    : <div></div>}

            </div>
        </div>
    )
};

export default TeamGamers;
