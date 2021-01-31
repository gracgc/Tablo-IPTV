import React, {useEffect, useRef, useState} from "react";
import c from './SavedGames.module.css'
import c1920 from './SavedGames_1920.module.css'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createNewGame, getSavedGames, setSavedGamesAC} from "../../../redux/games_reducer";
import SavedGame from "./SavedGame";
import {getGameNumber, setGameNumberAC} from "../../../redux/app_reducer";
import socket from "../../../socket/socket";
import {gameAPI} from "../../../api/api";

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


    let currentGame = savedGames.find(g => g.gameNumber === gameNumber)


    let lastGameNumber = savedGames[savedGames.length - 1].gameNumber


    let createFastGame = () => {
        dispatch(createNewGame('Быстрая игра', lastGameNumber + 1, 'Классический хоккей',
            'Команда 1',
            [],
            'Команда 2',
            []
        ))
    }

    let searchGame = useRef('')

    let [searchWord, setSearchWord] = useState('')

    let search = () => {
        setSearchWord(searchGame.current.value)
    }



    return (
        <div className={width === 1920 ? c1920.savedGames : c.savedGames}>
            <span className={width === 1920 ? c1920.menuTitle : c.menuTitle}>Список игр</span>
            <div className={width === 1920 ? c1920.iptv : c.iptv}>IPTV PORTAL <br/> TABLO beta</div>

            <div className={width === 1920 ? c1920.navbar : c.navbar}>
                <div className={width === 1920 ? c1920.search : c.search}>
                    Поиск по названию: <input className={width === 1920 ? c1920.searchInput : c.searchInput} type="text" ref={searchGame} onChange={(e) => search()}/>
                </div>
                {currentGame &&
                <div className={width === 1920 ? c1920.currentGame : c.currentGame}>
                    Текущая игра: {currentGame.gameNumber} — {currentGame.gameName} — {currentGame.gameType}
                    <div className={c.curentGameMenu}>Админ</div>
                    <div className={c.curentGameMenu}>Видео-админ</div>
                </div>}
                {savedGames.map(sg => (sg.gameName.indexOf(searchWord) !== -1) && <SavedGame gameNumber={gameNumber} savedGame={sg} savedGames={savedGames}/>)}
            </div>
            <NavLink to={'/tabloClient/'}>
                <div className={width === 1920 ? c1920.navButtonClient : c.navButtonClient}>
                    Табло
                </div>
            </NavLink>

            <NavLink to="/settings">
                <div className={width === 1920 ? c1920.devicesButton : c.devicesButton}>
                    Назначения устройств
                </div>
            </NavLink>

            <NavLink to="/createGame">
                <div className={width === 1920 ? c1920.createGameButton : c.createGameButton}>
                    Создать новую игру
                </div>
            </NavLink>


            <div className={width === 1920 ? c1920.createFastGameButton : c.createFastGameButton}
                 onClick={(e) => createFastGame()}>
                Быстрая игра
            </div>


        </div>
    )
};

export default SavedGames;
