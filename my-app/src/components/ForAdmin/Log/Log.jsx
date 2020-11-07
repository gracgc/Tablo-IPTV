import React, {useEffect} from 'react'
import c from './Log.module.css'
import {useDispatch, useSelector} from "react-redux";
import LogItem from "./LogItem";
import {getLog} from "../../../redux/log_reducer";
import {withRouter} from "react-router-dom";
import {compose} from "redux";


const Log = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const gameLog = useSelector(
        state => state.logPage.logData.gameLog
    );

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getLog(gameNumber));
    }, [gameLog.length]);

    return (
        <div className={c.log}>
            <div className={c.logWindow}>
                {gameLog.map(l => <LogItem logItem={l.item}/>)}
            </div>
        </div>

    )
};

export default compose(withRouter)(Log);
