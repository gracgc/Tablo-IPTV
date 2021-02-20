import React, {useEffect, useState} from 'react'
import c from './VideoAdmin.module.css'
import TabloEdit from "../AdminPanel/TabloEdit/TabloEdit";
import Info from "../AdminPanel/Info/Info";
import {compose} from "redux";
import {NavLink, withRouter} from "react-router-dom";
import Presets from "./Presets/Presets";
import Cameras from "./Cameras/Cameras";
import VideosMP4 from "./Videos/VideosMP4";
import Editor from "./Editor/Editor";

const VideoAdmin = (props) => {


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
            <div className={c.videoAdmin__presetsAndVideos}>
                <div>
                    <VideosMP4/>
                </div>
                <div>
                    <Presets/>
                </div>
            </div>
            <div className={c.videoAdmin__camera}>
                <div>
                    <Cameras/>
                </div>
            </div>
            <NavLink to="/">
                <div className={c.navBackButton}>
                    Вернуться в меню
                </div>
            </NavLink>
        </div>
    )
};

export default compose(withRouter)(VideoAdmin);
