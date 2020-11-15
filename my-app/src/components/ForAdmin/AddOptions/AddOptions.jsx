import React, {useEffect, useState} from 'react'
import c from './AddOptions.module.css'
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import * as axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setTimeOfPenaltyAC} from "../../../redux/teams_reducer";



const AddOptions = (props) => {

    let gameNumber = props.match.params.gameNumber;

    let dispatch = useDispatch();


    const putDeadline = (gameNumber, deadLine, timeMemTimer, timeDif, timeMem) => {
        return axios.put(`http://localhost:5000/api/time/deadline/${gameNumber}`, {
            deadLine,
            timeMemTimer,
            timeDif,
            timeMem
        })
    };

    const putNewDeadLine = (deadLine) => {
        putDeadline(gameNumber, deadLine, deadLine, 0, 0);
    };

    const timeOfPenalty = useSelector(
        state => state.teamsPage.timeOfPenalty
    );


    return (
        <div className={c.addOptions}>
            <div>
                <div><strong style={{fontSize: "120%"}}>Add Time</strong></div>
                <div className={c.overtimeButtons}>
                    <div className={c.overtimeButton} onClick={(e) => putNewDeadLine(300000)}>
                        5 min
                    </div>
                    <div className={c.overtimeButton} onClick={(e) => putNewDeadLine(1200000)}>
                        20min
                    </div>
                </div>
            </div>
            <div>
                <div><strong style={{fontSize: "120%"}}>Penalty</strong></div>
                <div className={c.overtimeButtons}>
                    <div className={c.overtimeButton} onClick={(e) => dispatch(setTimeOfPenaltyAC(120000))}>
                        2'
                    </div>
                    <div className={c.overtimeButton} onClick={(e) => dispatch(setTimeOfPenaltyAC(240000))}>
                        2'+2'
                    </div>
                    <div className={c.overtimeButton} onClick={(e) => dispatch(setTimeOfPenaltyAC(300000))}>
                        5'
                    </div>
                </div>
                <div className={c.overtimeButtons}>
                    <div className={c.overtimeButton} onClick={(e) => dispatch(setTimeOfPenaltyAC(600000))}>
                        10'
                    </div>
                    <div className={c.overtimeButton} onClick={(e) => dispatch(setTimeOfPenaltyAC(6000000))}>
                        Match
                    </div>
                    {/*<div className={c.overtimeButton}>*/}
                    {/*    Bullet*/}
                    {/*</div>*/}
                    <div className={c.overtimeButton} onClick={(e) => dispatch(setTimeOfPenaltyAC(10000))}>
                        TEST
                    </div>
                </div>
            </div>
            TIME OF PENALTY TEST: {Math.floor(timeOfPenalty / (1000 * 60))} min
        </div>

    )
};

export default compose(withRouter)(AddOptions);
