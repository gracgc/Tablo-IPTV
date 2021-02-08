import React, {useEffect} from 'react'
import c from './TabloClient1.module.css'
import c2 from './TabloClient2.module.css'
import c3 from './TabloClient3.module.css'
import TabloEventClient from "./TabloEventClient";
import {useDispatch, useSelector} from "react-redux";
import {getGame, setPresetAC} from "../../../redux/games_reducer";
import socket from "../../../socket/socket";
import classNames from 'classnames'
import {getCurrentVideo, setCurrentVideoDataAC} from "../../../redux/videos_reducer";


const TabloClient = (props) => {

    const dispatch = useDispatch();

    const preset = useSelector(
        (state => state.gamesPage.gameData.preset)
    );

    const currentVideo = useSelector(
        (state => state.videosPage.currentVideo)
    );

    useEffect(() => {
        dispatch(getGame(props.gameNumber));
        dispatch(getCurrentVideo())
    }, [props.gameNumber]);

    useEffect(() => {
        socket.on(`getPreset${props.gameNumber}`, preset => {
            dispatch(setPresetAC(preset))
        });

        socket.on(`getCurrentVideo`, currentVideo => {
            dispatch(setCurrentVideoDataAC(currentVideo));
            console.log(currentVideo)
        });
    }, []);

    let player = window.TvipPlayer;


    // useEffect(() => {
    //     if (player) {
    //         player.playUrl(currentVideo.videoURL, '');
    //         player.setVideoWindow(0, 0, 0, 0, false)
    //     } if (window.stb) {
    //         window.stb.play(currentVideo.videoURL)
    //     }
    // }, [player, currentVideo]);


    return (
        <div className={c.tablo}>
            {preset === 1 &&
            <div className={c.tablo1}>
                <div className={c.time}>
                    {props.minutesTimer <= 0 ? 0 : props.minutesTimer}:{props.secondsTimer < 10 ? '0' : ''}
                    {props.secondsTimer <= 0 ? 0 : props.secondsTimer}
                </div>
                {props.isShowLog ? <div className={c.tempLog}>{props.gameTempLog}</div> :
                    <div className={c.tempLog}></div>}
                <div>

                    <div className={props.secondsTimerTimeout < 6 ? c.timeout5sec : c.timeout}>
                        {(props.timeMemTimerTimeout > 0) &&
                        `Таймаут ${props.secondsTimerTimeout} секунд`
                        }
                    </div>
                    <div className={c.consLogHome}>
                        {props.gameConsLog && props.gameConsLog.map(gcl => (gcl.item !== '' && gcl.teamType === 'home') &&
                            <TabloEventClient key={gcl.id}
                                              item={gcl.item}
                                              id={gcl.id}
                                              teamType={gcl.teamType}
                                              timeMemTimer={props.timeMemTimer}
                                              gameNumber={props.gameNumber}
                            />)}
                    </div>
                    <div className={c.consLogGuests}>
                        {props.gameConsLog && props.gameConsLog.map(gcl => (gcl.item !== '' && gcl.teamType === 'guests') &&
                            <TabloEventClient key={gcl.id}
                                              item={gcl.item}
                                              id={gcl.id}
                                              teamType={gcl.teamType}
                                              timeMemTimer={props.timeMemTimer}
                                              gameNumber={props.gameNumber}
                            />)}
                    </div>

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
                        {props.minutesTimer <= 0 ? 0 : props.minutesTimer}:{props.secondsTimer < 10 ? '0' : ''}
                        {props.secondsTimer <= 0 ? 0 : props.secondsTimer}
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
