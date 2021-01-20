import React, {useEffect, useState} from 'react'
import c from './Presets.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {gameAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {getGame, setPresetAC} from "../../../../redux/games_reducer";
import socket from "../../../../socket/socket";
import {getVideos} from "../../../../redux/videos_reducer";

const Presets = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const preset = useSelector(
        (state => state.gamesPage.gameData.preset)
    );


    useEffect(() => {
        dispatch(getGame(gameNumber));


        socket.on(`getPreset${gameNumber}`, preset => {
            dispatch(setPresetAC(preset))
        });
    }, [])




    let presets = [
        {preset: 1, name: 'Только табло'},
        {preset: 2, name: 'Табло и видео'},
        {preset: 3, name: 'Только видео'},
        {preset: 4, name: 'Заглушка'},
        {preset: 5, name: 'Игроки 1'},
        {preset: 6, name: 'Игроки 2'},
    ]

    return (
        <div className={c.presets}>
            <div className={c.title}>Пресеты</div>
            {presets.map(p => <div className={p.preset === preset ? c.currentPreset :c.preset} onClick={(e) => {gameAPI.putPreset(gameNumber, p.preset)}}>
                {p.name}
            </div>)}
        </div>
    )
};

export default compose(withRouter)(Presets);