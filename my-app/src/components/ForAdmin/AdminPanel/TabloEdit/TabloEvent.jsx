import React, {useEffect} from 'react'
import c from './Tablo.module.css'
import c1920 from './Tablo_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import {addNewLog, addNewTempLog, deleteConsLog} from "../../../../redux/log_reducer";
import {changeGamerStatus, deleteGamer} from "../../../../redux/teams_reducer";


const TabloEvent = (props) => {

    let dispatch = useDispatch();

    const consLog = useSelector(
        state => state.logPage.logData.tabloLog.consLog
    );

    const deletedGamer = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType === props.teamType).gamers.find(g => g.id === props.id)
    );

    let secondsStopwatch = Math.floor(props.timeMem / 1000) % 60;
    let minutesStopwatch = Math.floor(props.timeMem / (1000 * 60)) + (props.period - 1) * 20;

    let penaltyTimer = props.timeMemTimer - deletedGamer.whenWasPenalty + deletedGamer.timeOfPenalty;

    let secondsTimerOfDeletedGamer =
        Math.floor(penaltyTimer / 1000) % 60;
    let minutesTimerOfDeletedGamer =
        Math.floor(penaltyTimer / (1000 * 60));

    const shouldPenaltyStop = penaltyTimer <= 0;


    useEffect(() => {
        if (deletedGamer.status === 'deleted'
            && (shouldPenaltyStop || props.timeMemTimer <= 0)
        ) {
            setTimeout(() => {
                dispatch(changeGamerStatus(props.gameNumber, props.teamType, deletedGamer.id));
                dispatch(addNewLog(props.gameNumber,
                    `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - ${deletedGamer.fullName} возвращается в игру`));
                dispatch(addNewTempLog(props.gameNumber, `${deletedGamer.fullName} возвращается в игру`));
                dispatch(deleteGamer(props.gameNumber, props.teamType, deletedGamer.id, 0, 0));
                dispatch(deleteConsLog(props.gameNumber, consLog.findIndex(c => c.id === deletedGamer.id && c.teamType === props.teamType)))
            }, (consLog.length - consLog.findIndex(c => c.id === deletedGamer.id && c.teamType === props.teamType))*100)
        }
    }, [shouldPenaltyStop]);


    return (
        <div className={props.width === 1920 ? c1920.consLogItem : c.consLogItem}>
            {(deletedGamer.whenWasPenalty !== 0) && <div>
                {props.item}  {minutesTimerOfDeletedGamer <= 0 ? 0 : minutesTimerOfDeletedGamer}
                :
                {secondsTimerOfDeletedGamer < 10 ? '0' : ''}
                {secondsTimerOfDeletedGamer < 1 ? 0 : secondsTimerOfDeletedGamer}
            </div>}
        </div>
    )
};

export default TabloEvent;
