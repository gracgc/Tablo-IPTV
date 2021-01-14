import React, {useEffect, useState} from 'react'
import c from './Presets.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {gameAPI} from "../../../../api/api";

const Presets = (props) => {

    let gameNumber = props.match.params.gameNumber;

    let presets = [1, 2, 3, 4, 5, 6]

    return (
        <div className={c.presets}>
            Пресеты
            {presets.map(p => <div className={c.preset} onClick={(e) => {gameAPI.putPreset(gameNumber, p)}}>
                {p}
            </div>)}
        </div>
    )
};

export default compose(withRouter)(Presets);