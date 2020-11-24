import {tabloAPI} from "../api/api";


const SET_TIME_DATA = 'time/SET_TIME_DATA';
const PUT_TIMER_STATUS = 'time/PUT_TIMER_STATUS';
const PUT_TIMEOUT_STATUS = 'time/PUT_TIMEOUT_STATUS';

let initialState = {
    gameTime: {
        timeData: {
            timeDif: 0,
            timeMem: 0,
            timeMemTimer: 1200000,
            deadLine: 1200000
        },
        dif: null,
        isRunning: false,
        runningTime: Date.now(),
        timeoutData: {
            timeData: {
                timeDif: 0,
                timeMem: 0,
                timeMemTimer: 0,
                deadLine: 0
            },
            dif: null,
            isRunning: false,
            runningTime: Date.now()
        },
        period: 1,
        smallOvertime: 0,
        bigOvertime: 0
    }
};

const tabloReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_TIME_DATA:

            return {
                ...state,
                gameTime: action.timeData
            };

        case PUT_TIMER_STATUS:

            return {
                ...state,
                gameTime: {
                    ...state.gameTime,
                    timeData: {
                        timeDif: action.timeDif, timeMem: action.timeMem,
                        timeMemTimer: action.timeMemTimer, deadLine: action.deadLine
                    },
                    isRunning: action.isRunning
                },
                period: action.period,
                smallOvertime: action.smallOvertime,
                bigOvertime: action.bigOvertime
            };

        case PUT_TIMEOUT_STATUS:

            return {
                ...state,
                gameTime: {
                    ...state.gameTime,
                    timeoutData: {
                        ...state.timeoutData,
                        timeData: {
                            timeDif: action.timeDif, timeMem: action.timeMem,
                            timeMemTimer: action.timeMemTimer, deadLine: action.deadLine
                        },
                        isRunning: action.isRunning
                    }
                }
            };


        default:
            return state;
    }
};

export const setTimeDataAC = (timeData) => ({type: SET_TIME_DATA, timeData});
export const setTimerStatusAC = (isRunning, currentLocalTime, timeDif,
                                 timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime) =>
    ({
        type: PUT_TIMER_STATUS, isRunning, currentLocalTime, timeDif,
        timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime
    });
export const setTimeoutStatusAC = (isRunning, currentLocalTime, timeDif,
                                   timeMem, timeMemTimer, deadLine) => ({
    type: PUT_TIMEOUT_STATUS, isRunning, currentLocalTime, timeDif,
    timeMem, timeMemTimer, deadLine
});


export const getTimeData = (gameNumber) => async (dispatch) => {
    let response = await tabloAPI.getTime(gameNumber);
    if (response.resultCode === 0) {
        dispatch(setTimeDataAC(response));
    }
};

export const putTimerStatus = (gameNumber, isRunning, timeDif,
                               timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime) =>
    async (dispatch) => {
        let response = await tabloAPI.putTimerStatus(gameNumber, isRunning, timeDif,
            timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime);
        if (response.resultCode === 0) {
            dispatch(setTimerStatusAC(isRunning, timeDif,
                timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime));
        }
    };

export const putTimeoutStatus = (gameNumber, isRunning, timeDif,
                                 timeMem, timeMemTimer, deadLine) => async (dispatch) => {
    let response = await tabloAPI.putTimeoutStatus(gameNumber, isRunning, timeDif,
        timeMem, timeMemTimer, deadLine);
    if (response.resultCode === 0) {
        dispatch(setTimeoutStatusAC(isRunning, timeDif,
            timeMem, timeMemTimer, deadLine));
    }
};


export default tabloReducer;







