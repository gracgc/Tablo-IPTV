import React from 'react'
import c from './Log.module.css'


const LogItem = (props) => {

    return (
        <div className={c.logItem}>
            {props.logItem}
        </div>
    )
};

export default LogItem;
