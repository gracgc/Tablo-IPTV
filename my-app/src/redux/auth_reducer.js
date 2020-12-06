import {authAPI} from "../api/api";
import cookie from "js-cookie"
import {reset, stopSubmit} from "redux-form";

const SET_ID = 'auth/SET_ID';


let initialState = {
    id: 1,
    isAuth: false
};

const authReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_ID:

            return {
                ...state,
                id: action.id,
                isAuth: true
            };

        default:
            return state;
    }
};

export const setIdAC = (id) => ({type: SET_ID, id});


export const login = (password) => async (dispatch) => {

    let response = await authAPI.login(password);
    if (response.resultCode === 0) {
        cookie.set('secretToken', response.token, { expires: 1, path: '/auth'});
        console.log(cookie.get('secretToken'))
        dispatch(setIdAC(response.id));
    } if (response.resultCode === 10) {
        dispatch(stopSubmit("login", {_error: 'Пароль не верный. Попробуйте снова'}))
    }
};

export default authReducer;
