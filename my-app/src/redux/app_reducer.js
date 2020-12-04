import {gameAPI} from "../api/api";

const SET_GAME_NUMBER = 'app/SET_GAME_NUMBER';
const PUT_GAME_NUMBER = 'app/PUT_GAME_NUMBER';


let initialState = {
    gameNumber: 1
};

const appReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_GAME_NUMBER:

            return {
                ...state,
                gameNumber: action.gameNumber
            };

        case PUT_GAME_NUMBER:

            return {
                ...state,
                gameNumber: action.gameNumber
            };

        default:
            return state;
    }
};

export const setGameNumberAC = (gameNumber) => ({type: SET_GAME_NUMBER, gameNumber});
export const putGameNumberAC = (gameNumber) => ({type: PUT_GAME_NUMBER, gameNumber});

export const getGameNumber = () => async (dispatch) => {
    let response = await gameAPI.getGameNumber();
    if (response.resultCode !== 10) {
        dispatch(setGameNumberAC(response.gameNumber));
    }
};

export const putGameNumber = (gameNumber) => async (dispatch) => {
    let response = await gameAPI.putGameNumber(+gameNumber);
    if (response.resultCode === 0) {
        dispatch(putGameNumberAC(+gameNumber));
    }
};


export default appReducer;
