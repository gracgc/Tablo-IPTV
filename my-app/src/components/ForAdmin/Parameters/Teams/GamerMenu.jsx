import React, {useState} from 'react'
import c from "./TeamGamers.module.css";
import c1920 from './TeamGamers_1920.module.css'
import ClickAwayListener from "@material-ui/core/ClickAwayListener";


const GamerMenu = (props) => {

    let width = window.innerWidth;

    let height = window.innerHeight;

    const gamerMenu = {
        Penalty: [
            {name: `2'`, timeOfPenalty: 120000},
            {name: `2'+2'`, timeOfPenalty: 240000},
            {name: `5'`, timeOfPenalty: 300000},
            {name: `10'`, timeOfPenalty: 600000},
            {name: `Match`, timeOfPenalty: 6000000},
            {name: `Return`, timeOfPenalty: 0}
        ],
        Goals: [{name: 'Add goal', symbol: '+'}, {name: 'Delete goal', symbol: '-'}]
    };

    const [y, setY] = useState();

    const [y2, setY2] = useState();

    const [showGamerMenu, setShowGamerMenu] = useState(false);
    const [showPenaltyMenu, setShowPenaltyMenu] = useState(false);
    const [showGoalsMenu, setShowGoalsMenu] = useState(false);


    const openGamerMenu = (y) => {
        setShowGamerMenu(!showGamerMenu)
        setY(y)
    };

    const handleClickAway = () => {
        setShowGamerMenu(false);
        setShowPenaltyMenu(false);
        setShowGoalsMenu(false)
    };


    let difY = height - y;

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div>
                <div className={showGamerMenu ? c.gamerActive : c.gamer} onClick={(e) => {
                    openGamerMenu(e.pageY)
                }}>
                    {props.fullName}
                </div>
                {showGamerMenu &&
                <div className={width === 1920 ? c1920.additionalMenu : c.additionalMenu}
                     style={difY < 100 ? {top: `${y - 30}px`} : {top: `${y}px`}}>
                    {Object.keys(gamerMenu).map(m => <div
                        className={width === 1920 ? c1920.additionalMenuItem : c.additionalMenuItem}
                        onMouseEnter={(e) => eval(`setShow${m}Menu(true)`)
                        }
                        onMouseLeave={(e) =>
                            eval(`setShow${m}Menu(false)`)
                        }
                    >
                        {m}
                        {eval(`show${m}Menu`) &&
                        <div className={width === 1920 ? c1920.addAddMenu : c.addAddMenu}
                             style={(difY < 330 && width === 1920 && m !== 'Goals') ? {top: `-200px`} : (difY < 180 && width !== 1920 && m !== 'Goals') ? {top: `-163px`} : {top: `0px`}}>
                            {eval(`gamerMenu.${m}`).map(am => <div m={m.toString()} className={am.name === 'Return'
                                ? c.returnGamer
                                : c.addAddMenuItem}
                                                                   onClick={(e) => {
                                                                       if (m === 'Goals') {
                                                                           props.addGamerGoal(props.gameNumber, props.teamType,
                                                                               props.id, am.symbol);
                                                                           handleClickAway()
                                                                       }
                                                                       if (m === 'Penalty') {
                                                                           props.changeStatus(props.gameNumber, props.teamType,
                                                                               props.id, am.timeOfPenalty)
                                                                           handleClickAway()
                                                                       }
                                                                   }
                                                                   }>
                                {am.name}
                            </div>)}
                        </div>}
                    </div>)}
                </div>}
            </div>
        </ClickAwayListener>
    )
};


export default GamerMenu;
