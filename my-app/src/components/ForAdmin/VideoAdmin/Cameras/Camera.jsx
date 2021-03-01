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
import {requiredShort} from "../../../../utils/validators";
import ReactHlsPlayer from "react-hls-player";


const Camera = (props) => {

    const [showDeleteButton, setShowDeleteButton] = useState(false);

    let deleteVideoFromList = (index) => {
        videosAPI.deleteVideo(index + props.paginatorForIndex)
        alert(index + props.paginatorForIndex)
    };


    return (
        <div style={{position: 'relative'}}
             onMouseOver={(e) => setShowDeleteButton(true)}
             onMouseLeave={(e) => setShowDeleteButton(false)}>
            <div className={props.currentVideoStream.videoURL === props.v.videoURL ? c.currentCamera : c.camera}
                 onClick={(e) => props.setCurrentVideo(props.v)}>
                <div>
                    {/*<ReactHlsPlayer*/}
                    {/*    url={props.v.videoURL}*/}
                    {/*    autoplay={false}*/}
                    {/*    muted={true}*/}
                    {/*    controls={false}*/}
                    {/*    width={170}*/}
                    {/*/>*/}
                </div>

                <div>
                    {props.v.videoName}
                </div>


            </div>

            {showDeleteButton && props.currentVideoStream.videoURL !== props.v.videoURL &&
            <div className={c.deleteVideo} onClick={e => deleteVideoFromList(props.index)}>
                ✘
            </div>
            }
        </div>


    )
};

export default compose(withRouter)(Camera);
