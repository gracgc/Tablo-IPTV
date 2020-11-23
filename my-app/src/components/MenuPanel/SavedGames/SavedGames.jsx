import React, {useEffect} from "react";
import c from './SavedGames.module.css'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getSavedGames} from "../../../redux/games_reducer";
import SavedGame from "./SavedGame";

const SavedGames = (props) => {

    const savedGames = useSelector(
        state => state.gamesPage.savedGames
    );

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getSavedGames());
    }, []);

    return (
        <div className={c.savedGames}>
            <span className={c.menuTitle}>Saved Games</span>

            <div className={c.navbar}>
                {savedGames.map(sg => <SavedGame savedGames={sg}/>)}
            </div>

            <NavLink to="/">
                <div className={c.navBackButton}>
                    Back to menu
                </div>
            </NavLink>
        </div>
    )
};

export default SavedGames;
