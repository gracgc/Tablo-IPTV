import {authAPI} from "../api/api";
import Cookies from "js-cookie"
import {stopSubmit} from "redux-form";

const SET_ID = 'auth/SET_ID';
const AUTH_FALSE = 'auth/AUTH_FALSE'


let initialState = {
    id: 1,
    isAuth: null
};

const authReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_ID:

            return {
                ...state,
                id: action.id,
                isAuth: true
            };

        case AUTH_FALSE:

            return {
                ...state,
                id: action.id,
                isAuth: false
            };

        default:
            return state;
    }
};

export const setIdAC = (id) => ({type: SET_ID, id});
export const authFalseAC = (id) => ({type: AUTH_FALSE, id});


export const login = (password) => async (dispatch) => {
    let response = await authAPI.login(password);
    if (response.resultCode === 0) {
        Cookies.set('secretToken', response.token, { expires: 2000000})
        dispatch(setIdAC(response.id));
    } if (response.resultCode === 10) {
        dispatch(stopSubmit("login", {_error: 'Пароль не верный. Попробуйте снова'}))
    }
};

export default authReducer;
