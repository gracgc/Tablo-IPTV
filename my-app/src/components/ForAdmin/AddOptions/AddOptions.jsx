import React, {useEffect, useState} from 'react'
import c from './AddOptions.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame} from "../../../redux/games_reducer";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import * as axios from "axios";
import {addNewLog, addNewTempLog} from "../../../redux/log_reducer";


const AddOptions = (props) => {

    let gameNumber = props.match.params.gameNumber;


    const putDeadline = (gameNumber, deadLine, timeMemTimer, timeDif, timeMem) => {
        return axios.put(`http://localhost:5000/api/time/deadline/${gameNumber}`, {
            deadLine,
            timeMemTimer,
            timeDif,
            timeMem
        })
    };

    const putNewDeadLine = (deadLine) => {
        putDeadline(gameNumber, deadLine, deadLine, 0, 0)
    };

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
                    <div className={c.overtimeButton}>
                        2'
                    </div>
                    <div className={c.overtimeButton}>
                        2'+2'
                    </div>
                    <div className={c.overtimeButton}>
                        5'
                    </div>
                </div>
                <div className={c.overtimeButtons}>
                    <div className={c.overtimeButton}>
                        10'
                    </div>
                    <div className={c.overtimeButton}>
                        Match
                    </div>
                    <div className={c.overtimeButton}>
                        Bullet
                    </div>
                </div>
            </div>
        </div>

    )
};

export default compose(withRouter)(AddOptions);
