import React, {useEffect, useState} from "react";
import c from './CustomGame.module.css'
import c1920 from './CustomGame_1920.module.css'
import {NavLink, withRouter} from "react-router-dom";
import {reduxForm} from "redux-form";
import {compose} from "redux";


const CustomGameForm = (props) => {

    let width = window.innerWidth;





    return (
        <div>
            <form onSubmit={props.handleSubmit}>

            </form>
        </div>
    )
};

const CustomGameReduxForm = reduxForm({form: 'customGame'})(CustomGameForm);


const CustomGame = (props) => {

    let width = window.innerWidth;

    let gameNumber = props.match.params.gameNumber;

    const onSubmit = (formData) => {

    };



    return (
        <div className={c.customGame}>
            <div className={width === 1920 ? c1920.customGamePanel : c.customGamePanel}>
                <CustomGameReduxForm onSubmit={onSubmit}

                />
            </div>

            <NavLink to={`/adminPanel/${gameNumber}`}>
                <div className={width === 1920 ? c1920.navBackButton : c.navBackButton}>
                    Назад
                </div>
            </NavLink>
        </div>
    )
};

export default compose(withRouter)(CustomGame);
