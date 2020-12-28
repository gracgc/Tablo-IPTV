import React, {useEffect, useState} from "react";
import c from './Video.module.css'
import c1920 from './Video_1920.module.css'
import video1 from '../../../content/video/videoplayback.mp4'
import video2 from '../../../content/video/videoplayback2.mp4'
import video3 from '../../../content/video/Самое короткое видео на YouTube.mp4'
import VideoPlayer from 'react-video-js-player';


const Video = (props) => {

    let width = window.innerWidth;

    let stb_player = window.TvipPlayer


    useEffect(() => {
        if (stb_player !== undefined) {
            let mrl = "http://str1.iptvportal.ru:8080/britko_2019-06-19--1/index.m3u8";
            let mrl1 = "https://www.hlsplayer.net/#type=m3u8&src=https%3A%2F%2Fbitmovin-a.akamaihd.net%2Fcontent%2Fplayhouse-vr%2Fm3u8s%2F105560.m3u8";
            stb_player.playUrl(mrl1, "live")
        }
    }, [stb_player])


    return (
        <div
            className={width === 1920 ? c1920.video : c.video}
        >
            {stb_player.playUrl("https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8", "live")}
        </div>
    )
}

export default Video;