import React, {useEffect, useState} from 'react'
import c from './VideosMP4.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {setPresetAC} from "../../../../redux/games_reducer";
import socket from "../../../../socket/socket";
import {getCurrentVideo, getVideos, getVideosMP4} from "../../../../redux/videos_reducer";
import {Field, reduxForm, reset} from "redux-form";
import {Input} from "../../../../common/FormsControls/FormsControls";
import Button from "@material-ui/core/Button";

import * as axios from "axios";
import {Draggable, Droppable} from "react-drag-and-drop";


const AddVideoMP4 = (props) => {

    return (

        <div className={c.addVideoForm}>
            <div className={c.exitForm} onClick={e => props.setShowAddVideoForm(false)}>
                ✘
            </div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.videoForm}>
                    <Field placeholder={'Название видео'} name={'videoName'}
                           component={Input}/>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Загрузить видео
                        <input
                            name="videoMP4"
                            type="file"
                            hidden
                            onChange={(e) => props.setVideoMP4(e.target.files[0])}
                        />
                    </Button>
                </div>
                <button className={c.addVideoButton}>
                    Добавить
                </button>
                {!props.videoMP4 ? <span style={{marginLeft: 10, color: 'red', fontSize: 20}}>Видео не загружено</span>
                    : <span style={{marginLeft: 10, color: 'green', fontSize: 20}}>Видео загружено</span>}
            </form>
        </div>


    )
};

const AddVideoReduxForm = reduxForm({form: 'addVideo'})(AddVideoMP4);

const VideosMP4 = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const [paginatorN, setPaginatorN] = useState(0);

    const paginatorScale = 3;


    const videos = useSelector(
        (state => state.videosPage.videosMP4)
    );

    let [videoMP4, setVideoMP4] = useState();

    const [showAddVideoForm, setShowAddVideoForm] = useState(false);


    useEffect(() => {
        dispatch(getVideosMP4());
    }, []);

    let setCurrentVideo = (currentVideo) => {
        videosAPI.putCurrentVideo(gameNumber, currentVideo, false)
    };

    let uploadVideo = (videoName) => {

        let videoFormData = new FormData;

        videoFormData.append('file', videoMP4);


        axios.post(`/api/videos/mp4/${videoName}`, videoFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

    };

    let changePaginatorN = (symbol) => {
        if (symbol === '+')
            setPaginatorN(paginatorN + 1);
        if (symbol === '-') {
            setPaginatorN(paginatorN - 1)
        }
    };

    const onSubmit = (formData) => {
        if (formData.videoName !== undefined && videoMP4) {
            uploadVideo(formData.videoName);
            dispatch(reset('addVideo'))
            setShowAddVideoForm(false)
        }
    };

    let onDrop = (data) => {

        let key = Object.keys(data);

        let firstKey = key[0];

        let k = videos.find(d => d.videoName === data[firstKey]);
        console.log(k)
    };

    return (
        <div className={c.camerasBlock}>
            <div className={c.title}>Видеоматериалы</div>
            <div style={{display: 'inline-flex'}}>
                <div className={c.video} style={{background: '#232961', color: 'white'}} onClick={e => setShowAddVideoForm(true)}>
                    Добавить видео
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
                <div className={c.videos}>
                    {videos.slice(paginatorScale * paginatorN, 3 + paginatorScale * paginatorN)
                        .map(v =>
                            <Draggable type="video" data={v.videoName}>
                                <div className={c.video} onClick={(e) => setCurrentVideo(v)}>
                                    {v.videoName}
                                </div>
                            </Draggable>
                            )}
                </div>
                {videos.slice(paginatorScale * (paginatorN + 1), 3 + paginatorScale * (paginatorN + 1)).length !== 0 ?
                    <div className={c.paginator} onClick={(e) => {
                        changePaginatorN('+')
                    }}>
                        →
                    </div> :
                    <div className={c.paginator} style={{opacity: '0.5'}}>
                        →
                    </div>}
            </div>
            {showAddVideoForm && <AddVideoReduxForm onSubmit={onSubmit} setShowAddVideoForm={setShowAddVideoForm}
                                                    videoMP4={videoMP4} setVideoMP4={setVideoMP4}/>}

        </div>
    )
};

export default compose(withRouter)(VideosMP4);
