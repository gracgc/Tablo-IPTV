import React, {useState} from 'react'
import c from "./TeamGamers.module.css";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";


const GamerMenu = (props) => {

    const gamerMenu = {
        Penalty: [{name: `2'`}, {name: `2'+2'`}, {name: `5'`}, {name: `10'`}, {name: `Match`}],
        Goals: [{name: 'Add goal', symbol: '+'}, {name: 'Delete goal', symbol: '-'}]
    };

    function menuAction (actionType, ...args) {
        if (actionType === 'Goals') {
            props.addGamerGoal(...args)
        } if (actionType === 'Penalty') {
            props.changeStatus(...args)
        }
    }


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
                <div className={c.gamer} onClick={(e) => openGamerMenu()}>
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
                            {eval(`gamerMenu.${m}`).map(am => <div m={m.toString()} className={c.addAddMenuItem}
                                                                   onClick={(e) => {
                                                                       menuAction(m,[props.gameNumber, props.teamType,
                                                                           props.id, am.symbol])
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
