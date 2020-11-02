import React from "react";
import c from './SavedGames.module.css'
import {NavLink} from "react-router-dom";

const SavedGame = (props) => {
    return (
        <div>
                <div className={c.navButton}>
                    {props.savedGames.gameNumber}
                    <div className={c.nameAndType}>
                        {props.savedGames.gameName} — {props.savedGames.gameType}
                    </div>
                    <NavLink to={'/adminPanel/' + props.savedGames.gameNumber}>
                        <div className={c.navButton}>
                            Admin
                        </div>
                    </NavLink>
                    <NavLink to={'/tabloClient/' + props.savedGames.gameNumber}>
                        <div className={c.navButton}>
                            Tablo
                        </div>
                    </NavLink>
                </div>
        </div>
    )
}

export default SavedGame;
