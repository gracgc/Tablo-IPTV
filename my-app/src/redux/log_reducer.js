// import {tabloAPI} from "../api/api";

const ADD_LOG = 'log/ADD_LOG';

let initialState = {
    logData: [

    ]
};

const logReducer = (state = initialState, action) => {

        switch (action.type) {
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
    }
;

export const addLogAC = (logItem) => ({type: ADD_LOG, logItem});



export default logReducer;
