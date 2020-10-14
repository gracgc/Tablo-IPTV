import React from 'react'
import c from './Log.module.css'
import {useSelector} from "react-redux";
import LogItem from "./LogItem";


const Log = (props) => {

    const logData = useSelector(
        state => state.logPage.logData
    );

    return (
        <div className={c.log}>
            <div className={c.logWindow}>
                {logData.map(l => <LogItem logItem={l.item}/>)}
            </div>
        </div>

    )
};

export default Log;
