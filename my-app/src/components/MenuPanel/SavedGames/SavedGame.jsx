import React from "react";
import c from './SavedGames.module.css'
import {NavLink} from "react-router-dom";
import {putGameNumber} from "../../../redux/app_reducer";
import {useDispatch, useSelector} from "react-redux";
import c1920 from "./SavedGames_1920.module.css";
import {useConfirm} from "material-ui-confirm";

const SavedGame = (props) => {

    let dispatch = useDispatch();

    const confirm = useConfirm();

    const setTabloGameNumber = async (gameNumber) => {
        await confirm({description: 'Сейчас на табло идет другая игра. Это действие может помешать игровому процессу.',
        title: 'Вы уверены?'});
        dispatch(putGameNumber(gameNumber))
    };


    let width = window.innerWidth;

    return (
            <div>
                <div className={width === 1920 ? c1920.navButton : c.navButton}>
                    {props.savedGames.gameNumber}
                    <div className={width === 1920 ? c1920.nameAndType : c.nameAndType}>
                        {props.savedGames.gameName} — {props.savedGames.gameType}
                    </div>
                    <div className={width === 1920 ? c1920.tabloChose : c.tabloChose}>
                        <NavLink to={'/adminPanel/' + props.savedGames.gameNumber}>
                            <div className={width === 1920 ? c1920.navButtonAdmin : c.navButtonAdmin}>
                                Админ
                            </div>
                        </NavLink>
                        {props.savedGames.gameNumber !== props.gameNumber
                            ? <div className={width === 1920 ? c1920.navButtonGameNumber : c.navButtonGameNumber}
                                   onClick={
                                       (e) => setTabloGameNumber(props.savedGames.gameNumber)
                                   }>
                                Поставить игру на табло
                            </div>
                            : <div style={{display: "inline-flex"}}>
                                <div style={{color: "#116327"}}>
                                    Эта игра сейчас идет
                                </div>
                                <div className={width === 1920 ? c1920.gameIsGoing : c.gameIsGoing}>●</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
    )
};

export default SavedGame;
