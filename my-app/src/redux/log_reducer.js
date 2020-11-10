import {logAPI} from "../api/api";


const ADD_LOG = 'log/ADD_LOG';
const SET_LOG_DATA = 'log/SET_LOG_DATA';
const ADD_TEMP_TABLO_LOG = 'ADD_TEMP_TABLO_LOG';
const ADD_CONS_TABLO_LOG = 'ADD_CONS_TABLO_LOG';

let initialState = {
    logData: {
        gameLog: [
            {item: ""}
        ],
        tabloLog: {
            tempLog: [
                {item: ""}
            ],
            consLog: [
                {item: ""}
            ]
        }
    }
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
                logData: {
                    ...state.logData,
                    gameLog: [...state.logData.gameLog, action.newLogItem]
                }
            };

        case ADD_TEMP_TABLO_LOG:

            return {
                ...state,
                logData: {
                    ...state.logData,
                    tabloLog: {
                        ...state.logData.tabloLog,
                        tempLog: [...state.logData.tabloLog.tempLog, action.newLogItem]
                    }
                }
            };

        case ADD_CONS_TABLO_LOG:

            return {
                ...state,
                logData: {
                    ...state.logData,
                    tabloLog: {
                        ...state.logData.tabloLog,
                        consLog: [...state.logData.tabloLog.consLog, action.payload]
                    }
                }
            };

        default:
            return state;
    }
};

export const setLogDataAC = (logData) => ({type: SET_LOG_DATA, logData});
export const addLogAC = (newLogItem) => ({type: ADD_LOG, newLogItem});
export const addTempTabloLogAC = (newLogItem) => ({type: ADD_TEMP_TABLO_LOG, newLogItem});
export const addConsTabloLogAC = (gamerId, teamType, newLogItem) => ({type: ADD_CONS_TABLO_LOG, payload: {gamerId, teamType, newLogItem}});

export const getLog = (gameNumber) => async (dispatch) => {
    let response = await logAPI.getLog(gameNumber);
    if (response.resultCode != 10) {
        dispatch(setLogDataAC(response));
    }
};

export const addNewLog = (gameNumber, newLogItem) => async (dispatch) => {
    let response = await logAPI.postLog(gameNumber, newLogItem);
    if (response.resultCode === 0) {
        dispatch(addLogAC(newLogItem));
    }
};

export const addNewTempLog = (gameNumber, newLogItem) => async (dispatch) => {
    let response = await logAPI.postTempLog(gameNumber, newLogItem);
    if (response.resultCode === 0) {
        dispatch(addTempTabloLogAC(newLogItem));
    }
};

export const addNewConsLog = (gameNumber, gamerId, teamType, newLogItem) => async (dispatch) => {
    let response = await logAPI.postConsLog(gameNumber, gamerId, teamType, newLogItem);
    if (response.resultCode === 0) {
        dispatch(addConsTabloLogAC(gamerId, teamType, newLogItem));
    }
};


export default logReducer;
