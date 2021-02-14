import React, {useEffect, useState} from 'react'
import c from './Cameras.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {setPresetAC} from "../../../../redux/games_reducer";
import socket from "../../../../socket/socket";
import {getCurrentVideo, getVideos, setCurrentVideoDataAC, setVideosDataAC} from "../../../../redux/videos_reducer";
import {Field, reduxForm, reset} from "redux-form";
import {Input} from "../../../../common/FormsControls/FormsControls";


const AddCamera = (props) => {
    return (
        <div className={c.addCameraForm}>
            <div className={c.exitForm} onClick={e => props.setShowAddCameraForm(false)}>
                ✘
            </div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.cameraForm}>
                    <Field placeholder={'Название потока'} name={'addCameraName'}
                           component={Input}/>
                    <Field placeholder={'URL потока'} name={'addCameraURL'}
                           component={Input}/>
                    <button className={c.addCameraButton}>
                        Добавить
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

    const [paginatorN, setPaginatorN] = useState(0);

    const paginatorScale = 3;


    const videos = useSelector(
        (state => state.videosPage.videos)
    );


    useEffect(() => {
        dispatch(getVideos());
        dispatch(getCurrentVideo());

        socket.on(`getPreset${gameNumber}`, preset => {
            dispatch(setPresetAC(preset))
        });


        socket.on(`getVideos`, videos => {
                dispatch(setVideosDataAC(videos))
            }
        );

    }, []);

    let changePaginatorN = (symbol) => {
        if (symbol === '+')
            setPaginatorN(paginatorN + 1);
        if (symbol === '-') {
            setPaginatorN(paginatorN - 1)
        }
    };

    let setCurrentVideo = (currentVideo) => {
        videosAPI.putCurrentVideo(currentVideo)
    };

    const onSubmit = (formData) => {
        if (formData.addCameraURL !== undefined) {
            videosAPI.addVideo(
                formData.addCameraName,
                formData.addCameraURL
            );
            dispatch(reset('addCamera'));
            setShowAddCameraForm(false)
        }
    };

    const [showAddCameraForm, setShowAddCameraForm] = useState(false);

    return (
        <div className={c.camerasBlock}>
            <div className={c.title}>Камеры</div>
            <div style={{display: 'inline-flex'}}>
                <div className={c.camera} style={{background: '#232961', color: 'white'}} onClick={e => setShowAddCameraForm(true)}>
                    Добавить камеру
                </div>
                {paginatorN > 0 ?
                    <div className={c.paginator} onClick={(e) => {
                        changePaginatorN('-')
                    }}>
                        ←
                    </div> :
                    <div className={c.paginator} style={{opacity: '0.5'}}>
                        ←
                    </div>
                }

                <div className={c.cameras}>

                    {videos.slice(paginatorScale * paginatorN, 3 + paginatorScale * paginatorN)
                        .map(v => <div className={c.camera} onClick={(e) => setCurrentVideo(v)}>
                            {v.videoName}
                        </div>)}
                </div>
                {videos.slice(paginatorScale * (paginatorN+1), 3 + paginatorScale * (paginatorN+1)).length !== 0 ?
                    <div className={c.paginator} onClick={(e) => {changePaginatorN('+')}}>
                        →
                    </div> :
                    <div className={c.paginator} style={{opacity: '0.5'}}>
                        →
                    </div>}
            </div>

            {showAddCameraForm && <AddCameraReduxForm onSubmit={onSubmit} setShowAddCameraForm={setShowAddCameraForm}/>}
        </div>
    )
};

export default compose(withRouter)(Cameras);
