import React from 'react'
import c from './AddOptions.module.css'
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import * as axios from "axios";


const AddOptions = (props) => {

    let gameNumber = props.match.params.gameNumber;


    const putDeadline = (gameNumber, deadLine, timeMemTimer, timeDif, timeMem) => {
        return axios.put(`/api/time/deadline/${gameNumber}`, {
            deadLine,
            timeMemTimer,
            timeDif,
            timeMem
        })
    };

    const putNewDeadLine = (deadLine) => {
        putDeadline(gameNumber, deadLine, deadLine, 0, 0);
    };


    return (
        <div className={c.addOptions}>
            <div>
                <div><strong style={{fontSize: "120%"}}>Add Time</strong></div>
                {props.period > 3
                    ? <div className={c.overtimeButtons}>
                    <div className={c.overtimeButton} onClick={(e) => putNewDeadLine(300000)}>
                        5 min
                    </div>
                    <div className={c.overtimeButton} onClick={(e) => putNewDeadLine(1200000)}>
                        20min
                    </div>
                </div>
                    : <div className={c.overtimeButtonsDis}>
                    <div className={c.overtimeButton} onClick={(e) => putNewDeadLine(300000)}>
                        5 min
                    </div>
                    <div className={c.overtimeButton} onClick={(e) => putNewDeadLine(1200000)}>
                        20min
                    </div>
                </div>}
            </div>
        </div>

    )
};

export default compose(withRouter)(AddOptions);
