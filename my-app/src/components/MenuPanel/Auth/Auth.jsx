import React, {useEffect, useState} from 'react'
import c from './Auth.module.css'
import c1920 from './Auth_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";
import {compose} from "redux";
import {Field, reduxForm, reset} from "redux-form";
import {InputPassword} from "../../../common/FormsControls/FormsControls";
import {login} from "../../../redux/auth_reducer";
import errorStyle from '../../../common/FormsControls/FormsControls.module.css'
import socket from "../../../socket/socket";


const AuthForm = (props) => {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.loginForm}>
                    <div className={c.appName}>TABLO-BETA</div>
                    <Field placeholder={'Пароль'} name={'password'}
                           component={InputPassword}/>
                    {props.error && <div className={errorStyle.formSummaryError}>{props.error}</div>}
                    <button className={c.loginButton}>
                        Войти
                    </button>
                </div>
            </form>
        </div>
    )
};

const LoginReduxForm = reduxForm({form: 'login'})(AuthForm);


const Auth = (props) => {

    const dispatch = useDispatch();

    let width = window.innerWidth;

    const onSubmit = (formData) => {
        dispatch(login(formData.password));
        if (isAuth) {
            socket.emit('addDevice', {pathname: props.history.location.pathname, isAuth: isAuth})
            return <Redirect to={"/menu"}/>
        }
    };

    const isAuth = useSelector(
        state => state.authPage.isAuth
    );


    return (
        <div className={c.loginPage}>
            <LoginReduxForm onSubmit={onSubmit}/>
        </div>
    )
};

export default compose(withRouter)(Auth);
