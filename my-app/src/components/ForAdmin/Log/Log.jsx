import React from 'react'
import c from './Log.module.css'
import {useDispatch, useSelector} from "react-redux";
import LogItem from "./LogItem";
import {withRouter} from "react-router-dom";
import {compose} from "redux";


const Log = (props) => {

    const gameLog = useSelector(
        state => state.logPage.logData.gameLog
    );

    return (
        <div className={c.log}>
            <div className={c.logWindow}>
                {gameLog.map(l => <LogItem logItem={l.item}/>)}
            </div>
        </div>

    )
};

export default compose(withRouter)(Log);
