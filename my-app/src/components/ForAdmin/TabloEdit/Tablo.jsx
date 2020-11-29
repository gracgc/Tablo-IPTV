import React from 'react'
import c from './Tablo.module.css'
import TabloEvent from "./TabloEvent";


const Tablo = (props) => {


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
                    Timeout {props.secondsTimerTimeout} seconds
                </div>}
                <div className={c.consLog}>
                    {props.gameConsLog && props.gameConsLog.map(gcl => gcl.item !== '' && <TabloEvent key={gcl.id}
                                                                                                      item={gcl.item}
                                                                                                      id={gcl.id}
                                                                                                      teamType={gcl.teamType}
                                                                                                      timeMemTimer={props.timeMemTimer}
                                                                                                      timeMem={props.timeMem}
                                                                                                      gameNumber={props.gameNumber}
                    />)}
                </div>

            </div>
            <div className={c.counters}>
                <div className={c.counter}>
                    <div className={c.addGoal} onClick={(e) => props.addTeamGoal('home', props.homeTeam.name, '+')}>+
                    </div>
                    <div className={c.deleteGoal}
                         onClick={(e) => props.addTeamGoal('home', props.homeTeam.name, '-')}>-
                    </div>
                    {props.homeCounter} <br/>
                    {props.homeTeam.name}
                </div>
                <div className={c.counter}>
                    <div className={c.addGoal}
                         onClick={(e) => props.addTeamGoal('guests', props.guestsTeam.name, '+')}>+
                    </div>
                    <div className={c.deleteGoal}
                         onClick={(e) => props.addTeamGoal('guests', props.guestsTeam.name, '-')}>-
                    </div>
                    {props.guestsCounter} <br/>
                    {props.guestsTeam.name}
                </div>
            </div>
        </div>
    )
};

export default Tablo;
