import React, {useEffect, useRef, useState} from 'react'
import c from './Cameras.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {gameAPI, videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {getGame, setPresetAC} from "../../../../redux/games_reducer";
import socket from "../../../../socket/socket";
import {getCurrentVideo, getVideos} from "../../../../redux/videos_reducer";

const Cameras = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();





    const videos = useSelector(
        (state => state.videosPage.videos)
    );


    useEffect(() => {
        dispatch(getVideos())
        dispatch(getCurrentVideo())

        socket.on(`getPreset${gameNumber}`, preset => {
            dispatch(setPresetAC(preset))
        });
    }, [])

    let setCurrentVideo = (currentVideo) => {
        videosAPI.putCurrentVideo(currentVideo)
    }


    return (
        <div className={c.camerasBlock}>
            <div className={c.title}>Камеры</div>
            <div className={c.cameras}>
                {videos.map(v => <div className={c.camera} onClick={(e) => setCurrentVideo(v)}>{v.videoName}</div>)}
            </div>
        </div>
    )
};

export default compose(withRouter)(Cameras);