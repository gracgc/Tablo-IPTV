import React, {useEffect, useRef, useState} from 'react'
import c from './Cameras.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {gameAPI, videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {getGame, setPresetAC} from "../../../../redux/games_reducer";
import socket from "../../../../socket/socket";
import {getCurrentVideo, getVideos} from "../../../../redux/videos_reducer";
import ReactHlsPlayer from "react-hls-player";
import {Field, reduxForm, reset} from "redux-form";
import {Input} from "../../../../common/FormsControls/FormsControls";
import {addNewLog} from "../../../../redux/log_reducer";

const AddCamera = (props) => {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.cameraForm}>
                    <Field placeholder={'URL потока'} name={'addCamera'}
                           component={Input}/>
                    <button className={c.addCameraButton}>
                        Play
                    </button>
                </div>
            </form>
        </div>
    )
};

const AddCameraReduxForm = reduxForm({form: 'addCamera'})(AddCamera);

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

    const onSubmit = (formData) => {
        if (formData.addCamera !== undefined) {
            videosAPI.putCurrentVideo({
                videoName: "videoTEST",
                videoURL: formData.addCamera,
                videoType: ""
            });
            dispatch(reset('addCamera'))
        }
    };

    return (
        <div className={c.camerasBlock}>
            <div className={c.title}>Камеры</div>
            <div className={c.cameras}>
                {videos.map(v => <div className={c.camera} onClick={(e) => setCurrentVideo(v)}>
                    {v.videoName}
                </div>)}
            </div>
            <AddCameraReduxForm onSubmit={onSubmit}/>
        </div>
    )
};

export default compose(withRouter)(Cameras);
