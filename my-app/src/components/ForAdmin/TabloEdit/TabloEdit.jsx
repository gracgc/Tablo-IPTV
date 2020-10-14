import React from 'react'
import c from './TabloEdit.module.css'
import {useState, useEffect} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {addGoalAC} from "../../../redux/teams_reducer";
import {addLogAC} from "../../../redux/log_reducer";



const TabloEdit = (props) => {

    const dispatch = useDispatch();

    const homeCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType == 'home').counter)
    );
    const guestsCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType == 'guests').counter)
    );

    const [isRunning, setIsRunning] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);


    const addTeamGoal = async (teamType) => {
        await setIsDisabled(true);
        await dispatch(addGoalAC(teamType));
        await stopGame();
        if (isRunning) {
            addLog('Timecode: STOP - GOAL!');
        } else {
            addLog('Timecode: GOAL!');
        }
        setTimeout(() =>
            setIsDisabled(false), 2000
        )
    };

    const addLog = (logItem) => {
        dispatch(addLogAC(logItem));
    };

    const startGame = () => {
        setIsRunning(true);
        addLog('Timecode: START')
    };

    const stopGame = () => {
        setIsRunning(false)
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
                        <div className={classNames(c.gameButtons__Active, c.gameButtons__stop)} onClick={stopGame}>
                            Stop
                        </div>
                    </div>
                    :
                    <div className={c.gameButtons}>
                        <div className={c.gameButtons__Active} onClick={startGame}>
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

export default TabloEdit;
