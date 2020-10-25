import {tabloAPI} from "../api/api";



const SET_TIME_DATA = 'time/SET_TIME_DATA';
const UPDATE_TIMEDIF_DATA = 'time/UPDATE_TIMEDIF_DATA';

let initialState = {
    timeData: {
        timeDif: null
    }
};

const timeReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_TIME_DATA:

            return {
                ...state,
                timeData: action.timeData
            };

        case UPDATE_TIMEDIF_DATA:

            return {
                ...state,
                timeData: {
                    ...state.timeData,
                    timeDif: action.timeDif
                }

            };

        default:
            return state;
    }
};

export const setTimeDataAC = (timeData) => ({type: SET_TIME_DATA, timeData});
export const updateTimeDifAC = (timeDif) => ({type: UPDATE_TIMEDIF_DATA, timeDif});

export const getTimeData = () => async (dispatch) => {
    let response = await tabloAPI.getTime();
    if (response.resultCode === 0) {
        dispatch(setTimeDataAC(response.timeData));
    }
};

export const updateTimeDif = (timeDif) => async (dispatch) => {
    let response = await tabloAPI.updateTimeDif(timeDif);
    if (response.resultCode === 0) {
        await dispatch(updateTimeDifAC(timeDif));
    }
};


export default timeReducer;







