import React, {useEffect, useState} from 'react'
import c from './VideosMP4.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import socket from "../../../../socket/socket";
import {
    getVideosMP4,
    setVideosMP4DataAC
} from "../../../../redux/videos_reducer";
import {Field, reduxForm, reset} from "redux-form";
import {Input} from "../../../../common/FormsControls/FormsControls";
import Button from "@material-ui/core/Button";
import * as axios from "axios";
import {Draggable} from "react-drag-and-drop";
import {requiredShort} from "../../../../utils/validators";
import VideoMP4 from "./VideoMP4";


const AddVideoMP4 = (props) => {

    return (

        <div className={c.addVideoForm}>
            <div className={c.exitForm} onClick={e => props.setShowAddVideoForm(false)}>
                ✘
            </div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.videoForm}>
                    <Field placeholder={'Название видео'} name={'videoName'}
                           validate={[requiredShort]}
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

    const paginatorScale = 4;


    const videos = useSelector(
        (state => state.videosPage.videosMP4)
    );

    let [videoMP4, setVideoMP4] = useState();

    const [showAddVideoForm, setShowAddVideoForm] = useState(false);


    useEffect(() => {
        dispatch(getVideosMP4());

        socket.on(`getVideosMP4`, videos => {
            dispatch(setVideosMP4DataAC(videos));
        });

    }, []);


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
            dispatch(reset('addVideo'));
            setShowAddVideoForm(false)
        }
    };


    return (
        <div className={c.camerasBlock}>
            <div className={c.title}>Видеоматериалы</div>
            <div style={{display: 'inline-flex'}}>
                <div className={c.addButton} onClick={e => setShowAddVideoForm(true)}>
                    +
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
                    {videos.slice(paginatorScale * paginatorN, paginatorScale + paginatorScale * paginatorN)
                        .map((v, index) =>
                            <VideoMP4 v={v} index={index} setIsMouseDownOverDrop={props.setIsMouseDownOverDrop}
                                      paginatorForIndex={paginatorN * paginatorScale}/>
                        )}
                </div>
                {videos.slice(paginatorScale * (paginatorN + 1), paginatorScale + paginatorScale * (paginatorN + 1)).length !== 0 ?
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
