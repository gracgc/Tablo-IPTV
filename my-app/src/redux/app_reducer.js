const SET_WIDTH = 'app/SET_WIDTH';


let initialState = {
    width: 0
};

const appReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_WIDTH:

            return {
                ...state,
                width: action.width
            };


        default:
            return state;
    }
};

export const setWidthAC = (width) => ({type: SET_WIDTH, width});




export default appReducer;
