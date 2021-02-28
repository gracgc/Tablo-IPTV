import React, {useEffect, useState} from 'react'
import c from './VideosMP4.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {Draggable} from "react-drag-and-drop";
import {videosAPI} from "../../../../api/api";


const VideosMP4 = (props) => {

    const [showDeleteButton, setShowDeleteButton] = useState(false);

    let deleteVideoFromList = (index, videoName) => {
        videosAPI.deleteVideoMP4(index + props.paginatorForIndex, videoName.toString())
    };


    return (

        <div className={c.video}
             onMouseOver={(e) => setShowDeleteButton(true)}
             onMouseLeave={(e) => setShowDeleteButton(false)}>
            <div onMouseDown={e => props.setIsMouseDownOverDrop(true)}
                 onMouseUp={e => props.setIsMouseDownOverDrop(false)}>
                <Draggable type="video" data={props.v.videoName}>
                    <video src={props.v.videoURL} width={170}></video>
                </Draggable>
            </div>

            <div>
                {props.v.videoName}
            </div>

            {showDeleteButton &&
            <div className={c.deleteVideo} onClick={e => deleteVideoFromList(props.index, props.v.videoName)}>
                ✘
            </div>

            }
        </div>

    )
};

export default compose(withRouter)(VideosMP4);
