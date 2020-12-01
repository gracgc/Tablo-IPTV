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
                        Создать новую игру
                    </div>
                </NavLink>

                <NavLink to="/savedGames" className={c.hov} activeClassName={c.activeLink}>
                    <div className={c.navButton}>
                        Загрузить игру
                    </div>
                </NavLink>

                <div>
                    <NavLink to="/settings" className={c.hov} activeClassName={c.activeLink}>
                        <div className={c.navButton}>
                            Настройки
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Menu;
