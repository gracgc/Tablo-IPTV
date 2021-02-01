import React from 'react'
import ClickAwayListener from "@material-ui/core/ClickAwayListener";


const GameMenu = (props) => {


    const openGameMenu = (y) => {
        props.setShowDeleteButton(!props.showDeleteButton)
    };

    const handleClickAway = () => {
        props.setShowDeleteButton(false)
    };


    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div onClick={openGameMenu} style={{textAlign: 'center', fontSize: '120%'}}>⚙</div>
        </ClickAwayListener>
    )
};


export default GameMenu;
