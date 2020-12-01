import * as axios from "axios";


export const teamsAPI = {
    getTeams(gameNumber) {
        return axios.get(`/api/teams/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    createTeams(gameNumber, homeName, homeGamers, guestsName, guestsGamers) {
        return axios.post(`/api/teams/${gameNumber}`,
            {homeName, homeGamers, guestsName, guestsGamers})
            .then(responce => {
                return responce.data
            })
    },
    gamerGoal(gameNumber, teamType, id, symbol) {
        return axios.put(`/api/teams/gamerGoal/${gameNumber}`, {teamType, id, symbol})
            .then(responce => {
                return responce.data
            })
    },
    teamGoal(gameNumber, teamType, symbol) {
        return axios.put(`/api/teams/teamGoal/${gameNumber}`, {teamType, symbol})
            .then(responce => {
                return responce.data
            })
    },
    gamerStatus(gameNumber, teamType, id) {
        return axios.put(`/api/teams/gamerStatus/${gameNumber}`, {teamType, id})
            .then(responce => {
                return responce.data
            })
    },
    gamerOnField(gameNumber, teamType, id, onField) {
        return axios.put(`/api/teams/onField/${gameNumber}`, {teamType, id, onField})
            .then(responce => {
                return responce.data
            })
    },
    deleteGamer(gameNumber, teamType, id, timeOfPenalty, whenWasPenalty) {
        return axios.put(`/api/teams/penalty/${gameNumber}`, {teamType, id, timeOfPenalty, whenWasPenalty})
            .then(responce => {
                return responce.data
            })
    }
};

export const logAPI = {
    getLog(gameNumber) {
        return axios.get(`/api/log/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    postLog(gameNumber, newLogItem) {
        return axios.post(`/api/log/${gameNumber}`, {newLogItem})
            .then(responce => {
                return responce.data
            })
    },
    deleteLog(gameNumber, deletedItem) {
        return axios.put(`/api/log/${gameNumber}`, {deletedItem})
            .then(responce => {
                return responce.data
            })
    },
    postTempLog(gameNumber, newLogItem) {
        return axios.post(`/api/log/temp/${gameNumber}`, {newLogItem})
            .then(responce => {
                return responce.data
            })
    },
    postConsLog(gameNumber, gamerId, teamType, newLogItem) {
        return axios.post(`/api/log/cons/${gameNumber}`, {gamerId, teamType, newLogItem})
            .then(responce => {
                return responce.data
            })
    },
    deleteConsLog(gameNumber, deletedItem) {
        return axios.put(`/api/log/cons/${gameNumber}`, {deletedItem})
            .then(responce => {
                return responce.data
            })
    }
};

export const gameAPI = {
    getGame(gameNumber) {
        return axios.get(`/api/game/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    getSavedGames() {
        return axios.get(`/api/savedGames`)
            .then(responce => {
                return responce.data
            })
    },
    createNewGame(gameName, gameNumber, gameType) {
        return axios.post(`/api/game`, {gameName, gameNumber, gameType})
            .then(responce => {
                return responce.data
            })
    },
    getGameNumber() {
        return axios.get(`/api/gameNumber`)
            .then(responce => {
                return responce.data
            })
    },
    putGameNumber() {
        return axios.put(`/api/gameNumber`)
            .then(responce => {
                return responce.data
            })
    }
};

export const tabloAPI = {
    getTime(gameNumber) {
        return axios.get(`/api/time/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    putTimerStatus(gameNumber, isRunning, timeDif,
                   timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime) {
        return axios.put(`/api/time/isRunning/${gameNumber}`, {
            isRunning,
            timeDif,
            timeMem,
            timeMemTimer,
            deadLine,
            period,
            smallOvertime,
            bigOvertime
        })
    },
    putTimeoutStatus(gameNumber, isRunning, timeDif,
                     timeMem, timeMemTimer, deadLine) {
        return axios.put(`/api/time/isRunningTimeout/${gameNumber}`, {
            isRunning,
            timeDif,
            timeMem,
            timeMemTimer,
            deadLine
        })
    }
};
