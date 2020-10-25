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

            return {
                ...state,
                logData: [...state.logData, action.newLogItem]
            };

        default:
            return state;
    }
};

export const setLogDataAC = (logData) => ({type: SET_LOG_DATA, logData});
export const addLogAC = (newLogItem) => ({type: ADD_LOG, newLogItem});

export const getLog = (gameNumber) => async (dispatch) => {
    let response = await logAPI.getLog(gameNumber);
    if (response.resultCode === 0) {
        dispatch(setLogDataAC(response));
    }
};

export const addNewLog = (gameNumber, newLogItem) => async (dispatch) => {
    let response = await logAPI.postLog(gameNumber, newLogItem);
    if (response.resultCode === 0) {
        dispatch(addLogAC(newLogItem));
    }

};


export default logReducer;
