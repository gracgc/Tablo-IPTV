import React from 'react'
import c from './TabloEdit.module.css'
import {useState, useEffect} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {addGoalAC, teamGoal} from "../../../redux/teams_reducer";
import {addNewLog} from "../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";


const TabloEdit = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const homeCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType == 'home').counter)
    );
    const guestsCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType == 'guests').counter)
    );

    const [isRunning, setIsRunning] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);


    const addTeamGoal = (teamType) => {
        setIsDisabled(true);
        dispatch(teamGoal(gameNumber, teamType, '+'));
        setIsRunning(false);
        if (isRunning) {
            dispatch(addNewLog(gameNumber,'Timecode: STOP - GOAL!'));
        } else {
            dispatch(addNewLog(gameNumber,'Timecode: GOAL!'));
        }
        setTimeout(() =>
            setIsDisabled(false), 2000
        )
    };

    const startGame = () => {
        setIsRunning(true);
        dispatch(addNewLog(gameNumber,'Timecode: START'));
    };

    const stopGame = () => {
        setIsRunning(false);
        dispatch(addNewLog(gameNumber,'Timecode: STOP'));
    };

    return (
        <div className={c.tabloEdit}>
            <div className={c.tablo}>
                <Tablo homeCounter={homeCounter} guestsCounter={guestsCounter}/>
            </div>
            <div className={c.allButtons}>
                {isRunning ?
                    <div className={c.gameButtons}>
                        <div className={c.gameButtons__Disabled}>
                            Start
                        </div>
                        <div className={classNames(c.gameButtons__Active, c.gameButtons__stop)} onClick={(e) => stopGame()}>
                            Stop
                        </div>
                    </div>
                    :
                    <div className={c.gameButtons}>
                        <div className={c.gameButtons__Active} onClick={(e) => startGame()}>
                            Start
                        </div>
                        <div className={classNames(c.gameButtons__Disabled, c.gameButtons__stop)}>
                            Stop
                        </div>
                    </div>
                }
                <div className={c.beepButtons}>
                    <div className={c.beepButtons_beep}>Beep</div>
                    <div className={c.beepButtons_beep}>Beeeep</div>
                </div>
                <div className={c.goalButtons}>
                    <button onClick={(e) => addTeamGoal('home')} disabled={isDisabled}
                         className={classNames(c.goalButtons_goal, c.home)}>
                        Goal
                    </button>
                    <button onClick={(e) => addTeamGoal('guests')} disabled={isDisabled}
                         className={classNames(c.goalButtons_goal, c.guests)}>
                        Goal
                    </button>
                </div>
            </div>
        </div>
    )
};

export default compose(withRouter)(TabloEdit);
