import React from "react";
import c from './SavedGames.module.css'
import {NavLink} from "react-router-dom";

const SavedGame = (props) => {
    return (
        <div className={c.savedGames}>
            <NavLink to="/adminPanel/:gameNumber?" className={c.hov} activeClassName={c.activeLink}>
                <div className={c.navButton}>
                    {props.savedGames.gameName} {props.savedGames.gameNumber} {props.savedGames.gameType}
                </div>
            </NavLink>
        </div>
    )
}

export default SavedGame;
