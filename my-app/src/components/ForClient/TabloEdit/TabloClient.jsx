import React, {useEffect} from 'react'
import c from './TabloClient1.module.css'
import c2 from './TabloClient2.module.css'
import c3 from './TabloClient3.module.css'
import TabloEventClient from "./TabloEventClient";
import {useDispatch, useSelector} from "react-redux";
import {getGame, setGameDataAC, setPresetAC} from "../../../redux/games_reducer";
import socket from "../../../socket/socket";



const TabloClient = (props) => {

    const dispatch = useDispatch();

    const preset = useSelector(
        (state => state.gamesPage.gameData.preset)
    );

    useEffect(() => {
        dispatch(getGame(props.gameNumber));

        socket.on(`getPreset${props.gameNumber}`, preset => {
            dispatch(setPresetAC(preset))
        });
    }, [props.gameNumber])



    return (
        <div className={c.tablo}>
            {preset === 1 &&
                <div className={c.tablo1}>
                    <div className={c.time}>
                        {props.minutesTimer <= 0 ? 0 : props.minutesTimer}:{props.secondsTimer < 10 ? '0' : ''}
                        {props.secondsTimer <= 0 ? 0 : props.secondsTimer}
                    </div>
                    {props.isShowLog ? <div className={c.tempLog}>{props.gameTempLog}</div> : <div></div>}
                    <div>
                        {(props.timeMemTimerTimeout > 0) &&
                        <div className={props.secondsTimerTimeout < 6 ? c.timeout5sec : c.timeout}>
                            Таймаут {props.secondsTimerTimeout} секунд
                        </div>}
                        <div className={c.consLog} >
                            {props.gameConsLog && props.gameConsLog.map(gcl => gcl.item !== '' && <TabloEventClient key={gcl.id}
                                                                                                                    item={gcl.item}
                                                                                                                    id={gcl.id}
                                                                                                                    teamType={gcl.teamType}
                                                                                                                    timeMemTimer={props.timeMemTimer}
                                                                                                                    gameNumber={props.gameNumber}
                            />)}
                        </div>

                    </div>
                    <div className={c.counters}>
                        <div className={c.counter}>
                            {props.homeCounter} <br/>
                            {props.homeTeam.name}
                        </div>
                        <div className={c.counter}>
                            {props.guestsCounter} <br/>
                            {props.guestsTeam.name}
                        </div>
                    </div>
                </div>
            }

            {preset === 2 &&
            <div className={c2.tablo2}>
                <div className={c2.counters2}>
                    <div className={c2.counter2}>
                        {props.homeCounter} <br/>
                        {props.homeTeam.name}
                    </div>
                    <div className={c2.time2}>
                        {props.minutesTimer <= 0 ? 0 : props.minutesTimer}:{props.secondsTimer < 10 ? '0' : ''}
                        {props.secondsTimer <= 0 ? 0 : props.secondsTimer}
                    </div>
                    <div className={c2.counter2}>
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
                    {props.homeTeam.name}
                </div>
                <div  className={c3.gamers}>
                    {props.homeTeam.gamers.map(g => <div>{g.gamerNumber} {g.fullName}</div>)}
                </div>

            </div>
            }
            {preset === 6 &&
            <div className={c3.tablo3}>
                <div className={c3.teamName}>
                    {props.guestsTeam.name}
                </div>
                <div  className={c3.gamers}>
                    {props.guestsTeam.gamers.map(g => <div>{g.gamerNumber} {g.fullName}</div>)}
                </div>
            </div>
            }
        </div>
    )
};

export default TabloClient;
