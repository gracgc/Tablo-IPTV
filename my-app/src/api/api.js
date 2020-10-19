import * as axios from "axios";



export const teamsAPI = {
    getTeams(gameNumber) {
        return axios.get(`http://localhost:5000/api/teams/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    }
};

export const logAPI = {
    getLog(gameNumber) {
        return axios.get(`http://localhost:5000/api/log/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    postLog(gameNumber, newLog) {
        return axios.post(`http://localhost:5000/api/log/${gameNumber}`, {item: newLog})
            .then(responce => {
                return responce.data
            })
    }
};

export const gameAPI = {
    getGame(gameNumber) {
        return axios.get(`http://localhost:5000/api/game/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    getSavedGames() {
        return axios.get(`http://localhost:5000/api/savedGames`)
            .then(responce => {
                return responce.data
            })
    },
    createNewGame(gameName, gameNumber, gameType) {
        return axios.post(`http://localhost:5000/api/game`, {gameName, gameNumber, gameType})
            .then(responce => {
                return responce.data
            })
    }
};
