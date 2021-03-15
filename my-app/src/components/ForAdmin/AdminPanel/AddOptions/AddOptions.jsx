import React from 'react'
import c from './AddOptions.module.css'
import c1920 from './AddOptions_1920.module.css'
import {NavLink, withRouter} from "react-router-dom";
import {compose} from "redux";
import {tabloAPI} from "../../../../api/api";


const AddOptions = (props) => {

    let gameNumber = props.match.params.gameNumber;

    let width = window.innerWidth;


    const putNewDeadLine = (deadLine) => {
        tabloAPI.putDeadline(gameNumber, deadLine, deadLine, 0, 0);
    };


    return (
        <div className={width === 1920 ? c1920.addOptions : c.addOptions}>
            <div>
                <div style={{fontSize: width === 1920 ? "32px" : "20px"}}>Доп. время</div>
                {props.period > 3
                    ? <div className={width === 1920 ? c1920.overtimeButtons : c.overtimeButtons}>
                        <div className={width === 1920 ? c1920.overtimeButton : c.overtimeButton}
                             onClick={(e) => putNewDeadLine(300000)}>
                            5 мин
                        </div>
                        <div className={width === 1920 ? c1920.overtimeButton : c.overtimeButton}
                             onClick={(e) => putNewDeadLine(1200000)}>
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
            <div style={{ marginTop:width === 1920 ? 60 : 40 }}>
                {!props.isRunningServer &&
                <div className={width === 1920 ? c1920.resetGameButton : c.resetGameButton}
                     onClick={(e) => props.resetGame()}>
                    РЕЗЕТ ИГРЫ
                </div>}

                {!props.isRunningServer && <NavLink to={`/customGame/${gameNumber}`}>
                    <div className={width === 1920 ? c1920.customGameButton : c.customGameButton}>
                        РЕДАКТИРОВАТЬ ИГРУ
                    </div>
                </NavLink>}
            </div>

        </div>

    )
};

export default compose(withRouter)(AddOptions);
