import React from "react";
import c from './Menu.module.css'
import c1920 from './Menu_1920.module.css'
import {NavLink} from "react-router-dom";

const Menu = (props) => {

    let width = window.innerWidth;

    return (
        <div className={width === 1920 ? c1920.menu : c.menu}>
            <span className={width === 1920 ? c1920.menuTitle : c.menuTitle}>TABLO ver.1</span>
            <div className={width === 1920 ? c1920.navbar : c.navbar}>
                <NavLink to="/createGame" className={c.hov} activeClassName={c.activeLink}>
                    <div className={width === 1920 ? c1920.navButton : c.navButton}>
                        Создать новую игру
                    </div>
                </NavLink>

                <NavLink to="/savedGames" className={c.hov} activeClassName={c.activeLink}>
                    <div className={width === 1920 ? c1920.navButton : c.navButton}>
                        Загрузить игру
                    </div>
                </NavLink>

                <div>
                    <NavLink to="/settings" className={c.hov} activeClassName={c.activeLink}>
                        <div className={width === 1920 ? c1920.navButton : c.navButton}>
                            Настройки
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Menu;
