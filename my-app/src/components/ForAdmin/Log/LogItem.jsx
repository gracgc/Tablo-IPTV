import React, {useEffect, useState} from 'react'
import c from './Log.module.css'
import c1920 from './Log_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import {deleteLog, getLog, setLogDataAC} from "../../../redux/log_reducer";
import socket from "../../../socket/socket";


const LogItem = (props) => {

    let dispatch = useDispatch();

    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const gameLog = useSelector(
        state => state.logPage.logData.gameLog
    );

    let deleteLogItem = (deletedItem) => {
        dispatch(deleteLog(props.gameNumber, deletedItem))
    };

    return (
        <div>
            <div className={props.width === 1920 ? c1920.logItem : c.logItem}
                 onMouseOver={(e) => setShowDeleteButton(true)}
                 onMouseLeave={(e) => setShowDeleteButton(false)}
            >
                {props.logItem}
                {showDeleteButton &&
                <div className={c.deleteButton} onClick={(e) => {deleteLogItem(gameLog.findIndex(c => c.id === props.id))}}>
                    ✖
                </div>}

            </div>
        </div>
    )
};

export default LogItem;
