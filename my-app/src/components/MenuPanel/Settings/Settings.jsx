import React from "react";
import c from './Settings.module.css'
import {NavLink} from "react-router-dom";

const Settings = (props) => {
    return (
        <div className={c.settings}>
            <div>Settings </div>
            <NavLink to="/" className={c.hov} activeClassName={c.activeLink}>
                <div className={c.navButton}>
                    Back to menu
                </div>
            </NavLink>
        </div>
    )
}

export default Settings;
