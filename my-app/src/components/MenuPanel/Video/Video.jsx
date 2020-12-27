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

    let [videoContent, setVideoContent] = useState(video2)


    let onPlayerReady = (player) => {
        setPlayer(player)
    }

    let playVideo = () => {
        player.play()
    }

    let stopVideo = () => {
        player.pause()
    }

    let chooseVideo = async (video) => {
        player.pause()
        player.src({type: 'video/mp4', src: video})
    }


    return (
        <div className={width === 1920 ? c1920.video : c.video}>
            <VideoPlayer
                controls={true}
                src={videoContent}
                width="720"
                height="420"
                onReady={onPlayerReady}
            />
            <button onClick={e => playVideo()}>play</button>
            <button onClick={e => stopVideo()}>stop</button>
            <button onClick={e => chooseVideo(video1)}>1</button>
            <button onClick={e => chooseVideo(video2)}>2</button>
            <button onClick={e => chooseVideo(video3)}>3</button>
        </div>
    )
}
export default Video;