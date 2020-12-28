import React, {useEffect, useState} from "react";
import c from './Video.module.css'
import c1920 from './Video_1920.module.css'
import video1 from '../../../content/video/videoplayback.mp4'
import video2 from '../../../content/video/videoplayback2.mp4'
import video3 from '../../../content/video/Самое короткое видео на YouTube.mp4'



const Video2 = (props) => {

    let width = window.innerWidth;

    // let [player, setPlayer] = useState()
    //
    // let [videoContent, setVideoContent] = useState(video2)
    //
    // let [videoIsRunning, setVideoIsRunning] = useState(true)
    //
    //
    // let onPlayerReady = (player) => {
    //     setPlayer(player)
    // }
    //
    // let playVideo = () => {
    //     setVideoIsRunning(true)
    // }
    //
    // let stopVideo = () => {
    //     setVideoIsRunning(false)
    // }
    //
    // let chooseVideo = async (video) => {
    //     player.src({type: 'video/webm', src: video})
    //     player.play()
    // }
    //
    // useEffect(() => {
    //     if (videoIsRunning && player) {
    //         player.play()
    //         player.muted(true)
    //     }
    //     if (!videoIsRunning && player) {
    //         player.pause()
    //         player.muted(true)
    //         player.requestFullscreen(true);
    //     }
    // }, [videoIsRunning, player])




    return (
        <div className={width === 1920 ? c1920.video : c.video}>
            {/*<VideoPlayer*/}
            {/*    controls={true}*/}
            {/*    src={videoContent}*/}
            {/*    onReady={onPlayerReady}*/}
            {/*/>*/}
            {/*<button onClick={e => playVideo()}>play</button>*/}
            {/*<button onClick={e => stopVideo()}>stop</button>*/}
            {/*<button onClick={e => chooseVideo(video1)}>1</button>*/}
            {/*<button onClick={e => chooseVideo(video2)}>2</button>*/}
            {/*<button onClick={e => chooseVideo(video3)}>3</button>*/}
            {/*<button onClick={e => chooseVideo(video4)}>4</button>*/}
        </div>
    )
}

export default Video2;