import React, {useEffect} from 'react'
import c from './Info.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame} from "../../../redux/games_reducer";
import {withRouter} from "react-router-dom";
import {compose} from "redux";



const Info = (props) => {

    let gameNumber = props.match.params.gameNumber;


    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getGame(gameNumber));
    }, []);

    return (
        <div className={c.info}>
            {gameData.gameName} {gameData.gameStatus} {gameData.gameType} 00:00:00
        </div>

    )
};

export default compose(withRouter)(Info);
