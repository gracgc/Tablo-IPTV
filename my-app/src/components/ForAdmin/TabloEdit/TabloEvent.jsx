import React, {useEffect} from 'react'
import c from './Tablo.module.css'
import {useDispatch, useSelector} from "react-redux";
import {addNewTempLog, deleteConsLog} from "../../../redux/log_reducer";
import {changeGamerStatus} from "../../../redux/teams_reducer";


const TabloEvent = (props) => {

    let dispatch = useDispatch();

    const deletedGamer = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType === props.teamType).gamers.find(g => g.id === props.id)
    );


    let secondsTimerOfDeletedGamer =
        Math.floor((props.timeMemTimer - deletedGamer.whenWasPenalty + deletedGamer.timeOfPenalty) / 1000) % 60;
    let minutesTimerOfDeletedGamer =
        Math.floor((props.timeMemTimer - deletedGamer.whenWasPenalty + deletedGamer.timeOfPenalty) / (1000 * 60));


    useEffect(() => {
        if (minutesTimerOfDeletedGamer <= 0 && secondsTimerOfDeletedGamer <= 0) {
            dispatch(deleteConsLog(props.gameNumber, deletedGamer));
            dispatch(changeGamerStatus(props.gameNumber, deletedGamer.teamType, deletedGamer.id, deletedGamer.status));
            dispatch(addNewTempLog(props.gameNumber, `${deletedGamer.fullName} returns to a game`))
        }
    });

    return (
        <div className={c.consLog}>
            {props.item} : {minutesTimerOfDeletedGamer}:{secondsTimerOfDeletedGamer}{deletedGamer.status}
        </div>
    )
};

export default TabloEvent;
