import React, {useEffect} from 'react'
import c from './Tablo.module.css'
import {useDispatch, useSelector} from "react-redux";
import {addNewTempLog, deleteConsLog} from "../../../redux/log_reducer";
import {changeGamerStatus, deleteGamer} from "../../../redux/teams_reducer";


const TabloEvent = (props) => {

    let dispatch = useDispatch();

    const deletedGamer = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType === props.teamType).gamers.find(g => g.id === props.id)
    );


    let secondsTimerOfDeletedGamer =
        Math.floor((props.timeMemTimer - deletedGamer.whenWasPenalty + deletedGamer.timeOfPenalty) / 1000) % 60;
    let minutesTimerOfDeletedGamer =
        Math.floor((props.timeMemTimer - deletedGamer.whenWasPenalty + deletedGamer.timeOfPenalty) / (1000 * 60));

    const shouldPenaltyStop = secondsTimerOfDeletedGamer < 0 && minutesTimerOfDeletedGamer < 0;


    useEffect(() => {
        if (shouldPenaltyStop) {
            dispatch(changeGamerStatus(props.gameNumber, props.teamType, deletedGamer.id, deletedGamer.status));
            dispatch(deleteGamer(props.gameNumber, props.teamType, deletedGamer.id, 0, 0));
            dispatch(deleteConsLog(props.gameNumber, deletedGamer));
            dispatch(addNewTempLog(props.gameNumber, `${deletedGamer.fullName} returns to a game`))
        }
    }, [shouldPenaltyStop]);


    return (
        <div className={c.consLog}>
            {props.item} : {minutesTimerOfDeletedGamer <= 0 ? 0 : minutesTimerOfDeletedGamer}
            :
            {secondsTimerOfDeletedGamer < 1 ? 0 : secondsTimerOfDeletedGamer}
        </div>
    )
};

export default TabloEvent;
