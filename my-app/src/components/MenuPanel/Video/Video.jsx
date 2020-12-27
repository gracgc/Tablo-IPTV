import React, {useEffect, useState} from "react";
import c from './Video.module.css'
import c1920 from './Video_1920.module.css'
import video1 from './videoplayback.mp4'
import video2 from './videoplayback2.mp4'
import video3 from './Самое короткое видео на YouTube.mp4'
import VideoPlayer from 'react-video-js-player';


const Video = (props) => {

    let width = window.innerWidth;

    let [player, setPlayer] = useState({})

    let [videoContent, setVideoContent] = useState(video1)


    let onPlayerReady = (player) => {
        setPlayer(player)
    }

    let playVideo = () => {
        player.play()
    }


    return (
        <div>
            <VideoPlayer
                controls={true}
                src={videoContent}
                width="720"
                height="420"
                onReady={onPlayerReady}
            />
            <button onClick={e => playVideo()}>play</button>
        </div>
    )
}
export default Video;