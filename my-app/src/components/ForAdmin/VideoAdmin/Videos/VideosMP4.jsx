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


const AddVideoMP4 = (props) => {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.videoForm}>
                    <Field placeholder={'Название видео'} name={'videoName'}
                           component={Input}/>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Добавить лого
                        <input
                            name="videoMP4"
                            type="file"
                            hidden
                            onChange={(e) => props.setVideoMP4(e.target.files[0])}
                        />
                    </Button>
                    <button className={c.addVideoButton}>
                        Добавить
                    </button>
                </div>
            </form>
        </div>
    )
};

const AddVideoReduxForm = reduxForm({form: 'addVideo'})(AddVideoMP4);

const VideosMP4 = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();


    const videos = useSelector(
        (state => state.videosPage.videosMP4)
    );

    let [videoMP4, setVideoMP4] = useState()


    useEffect(() => {
        dispatch(getVideosMP4());
    }, []);

    let setCurrentVideo = (currentVideo) => {
        videosAPI.putCurrentVideo(currentVideo)
    };

    let uploadVideo = (videoName) => {

        let videoFormData = new FormData;

        videoFormData.append('file', videoMP4)


        axios.post(`/api/videos/mp4`, videoName, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

    }

    const onSubmit = (formData) => {
        if (formData.videoName !== undefined && videoMP4) {
            uploadVideo(formData.videoName)
            dispatch(reset('addVideoMP4'))
        }
    };

    return (
        <div className={c.camerasBlock}>
            <div className={c.title}>Видеоматериалы</div>
            <div className={c.videos}>
                {videos.map(v => <div className={c.video} onClick={(e) => setCurrentVideo(v)}>
                    {v.videoName}
                </div>)}
            </div>
            <AddVideoReduxForm onSubmit={onSubmit}/>
        </div>
    )
};

export default compose(withRouter)(VideosMP4);
