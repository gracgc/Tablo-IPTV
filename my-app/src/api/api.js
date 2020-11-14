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
    teamGoal(gameNumber, teamType, symbol) {
        return axios.put(`http://localhost:5000/api/teams/teamGoal/${gameNumber}`, {teamType, symbol})
            .then(responce => {
                return responce.data
            })
    },
    gamerStatus(gameNumber, teamType, id) {
        return axios.put(`http://localhost:5000/api/teams/gamerStatus/${gameNumber}`, {teamType, id})
            .then(responce => {
                return responce.data
            })
    },
    gamerOnField(gameNumber, teamType, id, onField) {
        return axios.put(`http://localhost:5000/api/teams/onField/${gameNumber}`, {teamType, id, onField})
            .then(responce => {
                return responce.data
            })
    },
    deleteGamer(gameNumber, teamType, id, timeOfPenalty, whenWasPenalty) {
        return axios.put(`http://localhost:5000/api/teams/penalty/${gameNumber}`, {teamType, id, timeOfPenalty, whenWasPenalty})
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
    postLog(gameNumber, newLogItem) {
        return axios.post(`http://localhost:5000/api/log/${gameNumber}`, {newLogItem})
            .then(responce => {
                return responce.data
            })
    },
    postTempLog(gameNumber, newLogItem) {
        return axios.post(`http://localhost:5000/api/log/temp/${gameNumber}`, {newLogItem})
            .then(responce => {
                return responce.data
            })
    },
    postConsLog(gameNumber, gamerId, teamType, newLogItem) {
        return axios.post(`http://localhost:5000/api/log/cons/${gameNumber}`, {gamerId, teamType, newLogItem})
            .then(responce => {
                return responce.data
            })
    },
    deleteConsLog(gameNumber, deletedItem) {
        return axios.put(`http://localhost:5000/api/log/cons/${gameNumber}`, {deletedItem})
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

export const tabloAPI = {
    getTime() {
        return axios.get(`http://localhost:5000/api/time`)
            .then(responce => {
                return responce.data
            })
    },
    updateTimeDif(timeDif, timeMem, timeMemTimer) {
        return axios.put(`http://localhost:5000/api/time`, {timeDif, timeMem, timeMemTimer})
            .then(responce => {
                return responce.data
            })
    }
};
