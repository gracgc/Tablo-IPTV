import React from 'react'
import c from './AddOptions.module.css'
import c1920 from './AddOptions_1920.module.css'
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import * as axios from "axios";
import {useDispatch, useSelector} from "react-redux";



const AddOptions = (props) => {

    let gameNumber = props.match.params.gameNumber;

    let width = useSelector(
        state => state.appPage.width
    );

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
        <div className={width === 1920 ? c1920.addOptions : c.addOptions}>
            <div>
                <div><strong style={{fontSize: width === 1920 ? "28px" : "18px"}}>Доп. время</strong></div>
                {props.period > 3
                    ? <div className={width === 1920 ? c1920.overtimeButtons : c.overtimeButtons}>
                    <div className={width === 1920 ? c1920.overtimeButton : c.overtimeButton} onClick={(e) => putNewDeadLine(300000)}>
                        5 мин
                    </div>
                    <div className={width === 1920 ? c1920.overtimeButton : c.overtimeButton} onClick={(e) => putNewDeadLine(1200000)}>
                        20 мин
                    </div>
                </div>
                    : <div className={width === 1920 ? c1920.overtimeButtons : c.overtimeButtons}>
                    <div className={width === 1920 ? c1920.overtimeButtonDis : c.overtimeButtonDis}>
                        5 мин
                    </div>
                    <div className={width === 1920 ? c1920.overtimeButtonDis : c.overtimeButtonDis}>
                        20 мин
                    </div>
                </div>}
            </div>
        </div>

    )
};

export default compose(withRouter)(AddOptions);
