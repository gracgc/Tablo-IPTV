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
            <div className={c.nameAndType}>
                <strong>{gameData.gameName}</strong> — {gameData.gameType}
            </div>
            <div className={c.statusAndTime}>
               <strong>Status</strong>: {gameData.gameStatus} — <strong>Time</strong>: 00:00:00
            </div>

        </div>

    )
};

export default compose(withRouter)(Info);
