import React from "react";
import c from './Settings.module.css'
import {NavLink} from "react-router-dom";

const Settings = (props) => {

    let start = Date.now();
    let stop;

    setInterval(() => {
            stop = Date.now();
        }, 1000);


    return (
        <div className={c.settings}>
            <div>Settings</div>
            <div>
                {start} {stop}
            </div>
            <NavLink to="/" className={c.hov} activeClassName={c.activeLink}>
                <div className={c.navBackButton}>
                    Back to menu
                </div>
            </NavLink>
        </div>
    )
};

export default Settings;
