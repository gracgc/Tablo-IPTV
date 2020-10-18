import {gameAPI} from "../api/api";

const SET_GAME_DATA = 'games/SET_GAME_DATA';
const SET_SAVED_GAMES = 'games/SET_SAVED_GAMES';

let initialState = {
    gameData: {
        gameName: "",
        gameNumber: null,
        gameType: "",
        gameStatus: "",
        gameTime: null
    },
    savedGames: [
        {
            gameName: "",
            gameNumber: null,
            gameType: ""
        }
    ]
};

const gamesReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_GAME_DATA:

            return {
                ...state,
                gameData: action.gameData
            };

        case SET_SAVED_GAMES:

            return {
                ...state,
                savedGames: action.savedGames
            };

        default:
            return state;
    }
};

export const setGameDataAC = (gameData) => ({type: SET_GAME_DATA, gameData});
export const setSavedGamesAC = (savesGames) => ({type: SET_SAVED_GAMES, savesGames});


export const getGame = (gameNumber) => async (dispatch) => {
    let response = await gameAPI.getGame(gameNumber);

    dispatch(setGameDataAC(response));
};

export const getSavedGames = () => async (dispatch) => {
    let response = await gameAPI.getSavedGames();
    if (response.resultCode === 0) {
        dispatch(setSavedGamesAC(response.savedGames));
    }
};


export default gamesReducer;
