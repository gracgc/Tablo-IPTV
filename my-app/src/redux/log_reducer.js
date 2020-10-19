import {logAPI} from "../api/api";


const ADD_LOG = 'log/ADD_LOG';
const SET_LOG_DATA = 'log/SET_LOG_DATA';

let initialState = {
    logData: [
        {item: ""}
    ]
};

const logReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_LOG_DATA:

            return {
                ...state,
                logData: action.logData
            };

        case ADD_LOG:

            let newLog = {
                item: action.logItem
            };

            return {
                ...state,
                logData: [...state.logData, newLog]
            };

        default:
            return state;
    }
};

export const setLogDataAC = (logData) => ({type: SET_LOG_DATA, logData});
export const addLogAC = (logItem) => ({type: ADD_LOG, logItem});

export const getLog = (gameNumber) => async (dispatch) => {
    let response = await logAPI.getLog(gameNumber);
    dispatch(setLogDataAC(response));
};

export const addNewLog = (gameNumber,newLog) => async (dispatch) => {
    let responce = await logAPI.postLog(gameNumber, newLog);
    if (responce.resultCode === 0) {
        dispatch(addLogAC(newLog));
    }

};


export default logReducer;
