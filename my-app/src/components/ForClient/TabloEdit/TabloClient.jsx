import React, {useEffect, useState} from 'react'
import c from './TabloClient1.module.css'
import c2 from './TabloClient2.module.css'
import c3 from './TabloClient3.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame, setPresetAC} from "../../../redux/games_reducer";
import socket from "../../../socket/socket";
import classNames from 'classnames'
import {
    getCurrentVideo,
    getVideoEditor,
    setCurrentVideoDataAC, setCurrentVideoEditorDataAC,
} from "../../../redux/videos_reducer";
import TabloTimer from "./TabloTimer";
import STB from "./STB";


const TabloClient = (props) => {

    const dispatch = useDispatch();

    const preset = useSelector(
        (state => state.gamesPage.gameData.preset)
    );


    useEffect(() => {
        dispatch(getGame(props.gameNumber));
    }, [props.gameNumber]);


    useEffect(() => {

        socket.on(`getPreset${props.gameNumber}`, preset => {
            dispatch(setPresetAC(preset))
        });

    }, []);


    return (
        <div className={c.tablo}>

            {preset === 1 &&
            <div className={c.tablo1}>
                <div>
                    <TabloTimer gameNumber={props.gameNumber} gameConsLog={props.gameConsLog} isShowLog={props.isShowLog} gameTempLog={props.gameTempLog} preset={preset}/>
                </div>

                <div>
                    <div className={classNames(c.logo, c.homeLogo)}>
                        {props.homeTeam.logo &&
                        <img src={props.homeTeam.logo} style={{width: '500px', height: '500px'}} alt=""/>
                        }
                    </div>
                    <div className={classNames(c.logo, c.guestsLogo)}>
                        {props.guestsTeam.logo &&
                        <img src={props.guestsTeam.logo} style={{width: '500px', height: '500px'}} alt=""/>
                        }
                    </div>
                </div>
                <div>
                    <div className={classNames(c.counter, c.homeTeam)}>
                        {props.homeCounter} <br/>
                        {props.homeTeam.name.slice(0, 3).toUpperCase()}
                    </div>
                    <div className={classNames(c.counter, c.guestsTeam)}>
                        {props.guestsCounter} <br/>
                        {props.guestsTeam.name.slice(0, 3).toUpperCase()}
                    </div>
                </div>
            </div>
            }

            {preset === 2 &&
            <div>
                <div className={c2.tablo2}>
                    <div className={classNames(c2.counter2, c2.homeTeam2)}>
                        {props.homeCounter} <br/>
                        {props.homeTeam.name}
                    </div>
                    <div className={c2.time2}>
                        <TabloTimer gameNumber={props.gameNumber} gameConsLog={props.gameConsLog} isShowLog={props.isShowLog} gameTempLog={props.gameTempLog} preset={preset}/>
                    </div>
                    <div className={classNames(c2.counter2, c2.guestsTeam2)}>
                        {props.guestsCounter} <br/>
                        {props.guestsTeam.name}
                    </div>
                </div>
            </div>
            }
            {preset === 3 &&
            <div>
                <STB gameNumber={props.gameNumber}/>
            </div>
            }
            {preset === 4 &&
            <div className={c.tablo1}>
                <div className={c.tablo0}>TABLO</div>
            </div>
            }
            {preset === 5 &&
            <div className={c3.tablo3}>
                <div className={c3.teamName}>
                    {props.homeTeam.name} <br/>
                    {props.homeTeam.logo &&
                    <img src={props.homeTeam.logo} style={{width: '120px', height: '120px'}} alt=""/>
                    }
                </div>
                <div className={c3.gamers}>
                    {props.homeTeam.gamers.map(g => <div>{g.gamerNumber} {g.fullName}</div>)}
                </div>

            </div>
            }
            {preset === 6 &&
            <div className={c3.tablo3}>
                <div className={c3.teamName}>
                    {props.guestsTeam.name} <br/>
                    {props.guestsTeam.logo &&
                    <img src={props.guestsTeam.logo} style={{width: '120px', height: '120px'}} alt=""/>
                    }

                </div>
                <div className={c3.gamers}>
                    {props.guestsTeam.gamers.map(g => <div>{g.gamerNumber} {g.fullName}</div>)}
                </div>
            </div>
            }
        </div>
    )
};

export default TabloClient;
