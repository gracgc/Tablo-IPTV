import * as axios from "axios";



export const teamsAPI = {
    getTeams(gameNumber) {
        return axios.get(`http://localhost:5000/api/teams/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    createTeams(gameNumber, homeName, homeGamers, guestsName, guestsGamers) {
        return axios.post(`http://localhost:5000/api/teams/${gameNumber}`,
            {homeName, homeGamers, guestsName, guestsGamers})
            .then(responce => {
                return responce.data
            })
    },
    gamerGoal(gameNumber, teamType, id, symbol) {
        return axios.put(`http://localhost:5000/api/teams/gamerGoal/${gameNumber}`, {teamType, id, symbol})
            .then(responce => {
                return responce.data
            })
    },
    gamerStatus(gameNumber, teamType, id, gamerStatus) {
        return axios.put(`http://localhost:5000/api/teams/gamerStatus/${gameNumber}`, {teamType, id, gamerStatus})
            .then(responce => {
                return responce.data
            })
    },
};

export const logAPI = {
    getLog(gameNumber) {
        return axios.get(`http://localhost:5000/api/log/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    postLog(gameNumber, newLogItem) {
        return axios.post(`http://localhost:5000/api/log/${gameNumber}`, {newLogItem})
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
