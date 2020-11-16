import React, {useState} from 'react'
import c from './Log.module.css'
import {useDispatch, useSelector} from "react-redux";
import {deleteLog} from "../../../redux/log_reducer";


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
            <div className={c.logItem}
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
