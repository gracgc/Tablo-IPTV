import React, {useState} from 'react'
import c from './Editor.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {Droppable} from 'react-drag-and-drop'


const EditorLine = (props) => {

    let gameNumber = props.match.params.gameNumber;


    const [showDeleteButton, setShowDeleteButton] = useState(false);

    let deleteVideoFromEditor = (index) => {
        videosAPI.deleteVideoFromEditor(gameNumber, index, false)
    };

    let isDroppable = props.isMouseDownOverDrop && props.v.videoName === '|' && props.index !== props.deletedN * 2

    let onDrop = (data) => {

        if (isDroppable) {

            let key = Object.keys(data);

            let firstKey = key[0];

            let video = props.videosMP4.find(d => d.videoName === data[firstKey])

            let videos = props.allVideos.slice()


            if (videos.length === 0) {

                videos.splice(
                    props.index + 1,
                    0,
                    {
                        "videoName": "|",
                        "videoURL": "",
                        "duration": 3000
                    },
                    video,
                    {
                        "videoName": "|",
                        "videoURL": "",
                        "duration": 3000
                    })
            } else {

                videos.splice(
                    props.index + 1,
                    0,
                    video,
                    {
                        "videoName": "|",
                        "videoURL": "",
                        "duration": 3000
                    }
                )
            }

            videosAPI.addVideoEditor(gameNumber, videos)
        }

    };


    return (
        <div style={{display: 'inline-flex'}}>
            <Droppable
                types={['video']}
                onDrop={(e) => onDrop(e)}
            >
                <div className={c.video}
                     style={props.videoEditor.editorData.duration !== 0
                         ? {
                             width: props.v.duration / props.scale,
                             opacity: isDroppable && 1.0,
                             backgroundColor: isDroppable && '#defff0'
                         }
                         : {display: "none"}}
                     onMouseOver={(e) => setShowDeleteButton(true)}
                     onMouseLeave={(e) => setShowDeleteButton(false)}>
                    <div>
                        {props.v.videoName.slice(0, 5)}
                        {props.v.videoName.length > 5 && '.'}
                    </div>


                    <video src={props.v.videoURL} style={props.v.duration / props.scale < 155
                        ? {width: props.v.duration / props.scale, margin: 'auto'}
                        : {width: 155, margin: 'auto'}}/>
                    {props.v.videoName !== '|' && showDeleteButton
                    && (props.index !== props.deletedN * 2 + 1 || !props.isRunningServer)

                        ? <div className={c.exitForm} onClick={e => deleteVideoFromEditor(props.index)}>
                            Удалить
                        </div>
                        : <div></div>
                    }
                </div>
            </Droppable>
        </div>
    )
};

export default compose(withRouter)(EditorLine);
