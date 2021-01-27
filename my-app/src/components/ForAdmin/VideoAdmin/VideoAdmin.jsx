import React, {useEffect, useState} from 'react'
import c from './VideoAdmin.module.css'
import TabloEdit from "../AdminPanel/TabloEdit/TabloEdit";
import Info from "../AdminPanel/Info/Info";
import {compose} from "redux";
import {NavLink, withRouter} from "react-router-dom";
import Presets from "./Presets/Presets";
import Cameras from "./Cameras/Cameras";
import Editor from "./Editor/Editor";

const VideoAdmin = (props) => {

    let gameNumber = props.match.params.gameNumber;

    return (
        <div className={c.videoAdmin}>
            <div className={c.videoAdmin__info}>
                <Info/>
            </div>
            <div className={c.videoAdmin__editor}>
                <div>
                    <Editor/>
                </div>
                <div>
                    <TabloEdit/>
                </div>
            </div>
            <div className={c.videoAdmin__presetsAndCamera}>
                <div>
                    <Cameras/>
                </div>
                <div>
                    <Presets/>
                </div>
            </div>
            <div className={c.videoAdmin__animations}>
                <div>
                    Анимации
                </div>
                <div>
                    Видеоматериалы
                    <NavLink to="/">
                        <div className={c.navBackButton}>
                            Вернуться в меню
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
    )
};

export default compose(withRouter)(VideoAdmin);
