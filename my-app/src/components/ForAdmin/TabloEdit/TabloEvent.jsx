import React from 'react'
import c from './Tablo.module.css'
import {useSelector} from "react-redux";



const TabloEvent = (props) => {

    const deletedGamer = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType === props.teamType).gamers.find(g => g.id === props.id)
    );



    return (
        <div className={c.consLog}>
            {props.item} ID:{props.id} TEST:{deletedGamer.fullName}
        </div>
    )
};

export default TabloEvent;
