import React from "react";
import c from './Menu.module.css'
import {NavLink} from "react-router-dom";

const Menu = (props) => {
    return (
        <div className={c.menu}>
            <span className={c.menuTitle}>TABLO ver.1</span>
            <div className={c.navbar}>
                <NavLink to="/createGame" className={c.hov} activeClassName={c.activeLink}>
                    <div className={c.navButton}>
                        Create New Game
                    </div>
                </NavLink>

                <NavLink to="/savedGames" className={c.hov} activeClassName={c.activeLink}>
                    <div className={c.navButton}>
                        Load game
                    </div>
                </NavLink>

                <div>
                    <NavLink to="/settings" className={c.hov} activeClassName={c.activeLink}>
                        <div className={c.navButton}>
                            Settings
                        </div>
                    </NavLink>
                    <NavLink to="/tabloClient" className={c.hov} activeClassName={c.activeLink}>
                        <div className={c.navButton}>
                            TABLO FOR CLIENT 'TEMP BUTTON'
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Menu;
