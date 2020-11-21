import React, {useState} from 'react'
import c from "./TeamGamers.module.css";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";


const GamerMenu = (props) => {

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


    const [showGamerMenu, setShowGamerMenu] = useState(false);
    const [showPenaltyMenu, setShowPenaltyMenu] = useState(false);
    const [showGoalsMenu, setShowGoalsMenu] = useState(false);

    const openGamerMenu = () => {
        setShowGamerMenu(!showGamerMenu)
    };

    const handleClickAway = () => {
        setShowGamerMenu(false);
        setShowPenaltyMenu(false);
        setShowGoalsMenu(false)
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div>
                <div className={showGamerMenu ? c.gamerActive : c.gamer} onClick={(e) => openGamerMenu()}>
                    {props.fullName}
                </div>
                {showGamerMenu &&
                <div className={c.additionalMenu}>
                    {Object.keys(gamerMenu).map(m => <div className={c.additionalMenuItem}
                                                          onMouseEnter={(e) => eval(`setShow${m}Menu(true)`)}
                                                          onMouseLeave={(e) => eval(`setShow${m}Menu(false)`)}
                    >
                        {m}
                        {eval(`show${m}Menu`) &&
                        <div className={c.addAddMenu}>
                            {eval(`gamerMenu.${m}`).map(am => <div m={m.toString()} className={am.name === 'Return'
                                ? c.returnGamer
                                :c.addAddMenuItem}
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
