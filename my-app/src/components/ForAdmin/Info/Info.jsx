import React, {useEffect} from 'react'
import c from './Info.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame} from "../../../redux/games_reducer";



const Info = (props) => {

    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getGame(1));
    }, []);

    return (
        <div className={c.info}>
            {gameData.gameName} {gameData.gameStatus} {gameData.gameType} 00:00:00
        </div>

    )
};

export default Info;
