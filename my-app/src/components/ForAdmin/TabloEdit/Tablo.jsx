import React from 'react'
import c from './Tablo.module.css'


const Tablo = (props) => {



    // let penaltyMinutes = props.minutesTimer - (props.minutesTimer + penalty);
    // let penaltySeconds = props.secondsTimer - (props.secondsTimer + penalty);

    return (
        <div className={c.tablo}>
            <div className={c.time}>
                {props.minutesTimer}:{props.secondsTimer < 10 ? '0' : ''}{props.secondsTimer}
            </div>
            {props.isShowLog ? <div className={c.tempLog}>{props.gameTempLog}</div> : <div></div>}
            <div>
                {props.gameConsLog && props.gameConsLog.map(gcl => gcl.item !== '' && <div className={c.consLog}>{gcl.item}</div>)}
            </div>
            <div className={c.counters}>
                <div className={c.counter}>
                    {props.homeCounter} <br/>
                    Home
                </div>
                <div className={c.counter}>
                    {props.guestsCounter} <br/>
                    Guests
                </div>
            </div>
        </div>
    )
};

export default Tablo;
