import React from "react";
import c from './CreateGame.module.css'
import {NavLink} from "react-router-dom";

const CreateGame = (props) => {
    return (
        <div className={c.createGame}>
            <div>
                Create Game
            </div>
            <NavLink to="/" className={c.hov} activeClassName={c.activeLink}>
                <div className={c.navButton}>
                    Back to menu
                </div>
            </NavLink>
        </div>
    )
}

export default CreateGame;
