import React from "react";
import c from './SavedGames.module.css'
import {NavLink} from "react-router-dom";

const SavedGame = (props) => {
    return (
        <div>
            <NavLink to={'/adminPanel/' + props.savedGames.gameNumber}>
                <div className={c.navButton}>
                    {props.savedGames.gameNumber}
                    <div className={c.nameAndType}>
                        {props.savedGames.gameName} — {props.savedGames.gameType}
                    </div>
                </div>
            </NavLink>
        </div>
    )
}

export default SavedGame;
