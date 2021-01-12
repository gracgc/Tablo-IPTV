import React, {useEffect, useState} from "react";
import c from './Video.module.css'
import c1920 from './Video_1920.module.css'




const Video = (props) => {

    let width = window.innerWidth


    return (
        <div
            className={width === 1920 ? c1920.video : c.video}
        >

        </div>
    )
}

export default Video;