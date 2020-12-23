import React, {useEffect} from "react";
import c from './SavedGames.module.css'
import c1920 from './SavedGames_1920.module.css'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getSavedGames, setSavedGamesAC} from "../../../redux/games_reducer";
import SavedGame from "./SavedGame";
import {getGameNumber, setGameNumberAC} from "../../../redux/app_reducer";
import socket from "../../../socket/socket";

const SavedGames = (props) => {

    const savedGames = useSelector(
        state => state.gamesPage.savedGames
    );

    let gameNumber = useSelector(
        state => state.appPage.gameNumber
    );

    let width = window.innerWidth;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSavedGames());
        dispatch(getGameNumber())

        socket.on('getGameNumber', gameNumber => {
            dispatch(setGameNumberAC(gameNumber));
            }
        );

        socket.on('getSavedGames', games => {
            dispatch(setSavedGamesAC(games));
        })

    }, []);



    return (
        <div className={width === 1920 ? c1920.savedGames : c.savedGames}>
            <span className={width === 1920 ? c1920.menuTitle : c.menuTitle}>Сохраненные игры</span>

            <div className={width === 1920 ? c1920.navbar : c.navbar}>
                {savedGames.map(sg => <SavedGame gameNumber={gameNumber} savedGame={sg} savedGames={savedGames}/>)}
            </div>
            <NavLink to={'/tabloClient/'}>
                <div className={width === 1920 ? c1920.navButtonClient : c.navButtonClient}>
                    Табло
                </div>
            </NavLink>

            <NavLink to="/">
                <div className={width === 1920 ? c1920.navBackButton : c.navBackButton}>
                    Вернуться в меню
                </div>
            </NavLink>
        </div>
    )
};

export default SavedGames;
