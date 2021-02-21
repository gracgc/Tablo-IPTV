import React, {useState} from 'react'
import c from './Editor.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";


const EditorLine = (props) => {

    let gameNumber = props.match.params.gameNumber;


    const [showDeleteButton, setShowDeleteButton] = useState(false);

    let deleteVideoFromEditor = (index) => {
        videosAPI.deleteVideoFromEditor(gameNumber, index)
    };


    return (
        <div>
            <div style={{display: 'inline-flex'}}>
                <div className={c.video}
                     style={props.videoEditor.editorData.duration !== 0
                         ? {width: props.v.duration / props.scale}
                         : {display: "none"}}
                     onMouseOver={(e) => setShowDeleteButton(true)}
                     onMouseLeave={(e) => setShowDeleteButton(false)}>
                    <div>
                        {props.v.videoName.slice(0, 4)}
                        {props.v.videoName.length > 4 && '.'}
                    </div>


                    <video src={props.v.videoURL} style={props.v.duration / props.scale < 155
                        ? {width: props.v.duration / props.scale, margin: 'auto'}
                        : {width: 155, margin: 'auto'}}/>
                    {props.v.videoName !== '|' && showDeleteButton
                    && props.currentDuration >= props.videos.map(v => v.duration).slice(0, props.index + 2)
                        .reduce((sum, current) => sum + current, 0)

                        ? <div className={c.exitForm} onClick={e => deleteVideoFromEditor(props.index)}>
                            Удалить
                        </div>
                        : <div></div>
                    }
                </div>
            </div>

        </div>

    )
};

export default compose(withRouter)(EditorLine);
