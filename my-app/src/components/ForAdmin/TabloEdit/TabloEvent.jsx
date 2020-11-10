import React, {useEffect} from 'react'
import c from './Tablo.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getTeams} from "../../../redux/teams_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";


const TabloEvent = (props) => {

    const dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const deletedGamer = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType === props.teamType).gamers.find(g => g.id === props.id)
    );

    console.log(deletedGamer);

    // useEffect(() => {
    //             dispatch(getTeams(props.gameNumber))
    //     }, []);
    //
    // useEffect(() => {
    //         let interval = setInterval(() => {
    //             dispatch(getTeams(props.gameNumber))
    //         }, 1000);
    //         return () => clearInterval(interval);
    //     }
    // );


    return (
        <div className={c.consLog}>
            {props.item} ID:{props.id} TEST:{deletedGamer.id}
        </div>
    )
};

export default compose(withRouter)(TabloEvent);
