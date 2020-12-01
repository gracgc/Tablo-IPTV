import React from 'react'
import c from './TabloClient.module.css'
import TabloEventClient from "./TabloEventClient";



const TabloClient = (props) => {

    return (
        <div className={c.tablo}>
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
    )
};

export default TabloClient;
