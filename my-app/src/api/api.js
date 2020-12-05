import * as axios from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL: '/api/'
});


export const teamsAPI = {
    getTeams(gameNumber) {
        return instance.get(`teams/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    createTeams(gameNumber, homeName, homeGamers, guestsName, guestsGamers) {
        return instance.post(`teams/${gameNumber}`,
            {homeName, homeGamers, guestsName, guestsGamers})
            .then(responce => {
                return responce.data
            })
    },
    gamerGoal(gameNumber, teamType, id, symbol) {
        return instance.put(`teams/gamerGoal/${gameNumber}`, {teamType, id, symbol})
            .then(responce => {
                return responce.data
            })
    },
    teamGoal(gameNumber, teamType, symbol) {
        return instance.put(`teams/teamGoal/${gameNumber}`, {teamType, symbol})
            .then(responce => {
                return responce.data
            })
    },
    gamerStatus(gameNumber, teamType, id) {
        return instance.put(`teams/gamerStatus/${gameNumber}`, {teamType, id})
            .then(responce => {
                return responce.data
            })
    },
    gamerOnField(gameNumber, teamType, id, onField) {
        return instance.put(`teams/onField/${gameNumber}`, {teamType, id, onField})
            .then(responce => {
                return responce.data
            })
    },
    deleteGamer(gameNumber, teamType, id, timeOfPenalty, whenWasPenalty) {
        return instance.put(`teams/penalty/${gameNumber}`, {teamType, id, timeOfPenalty, whenWasPenalty})
            .then(responce => {
                return responce.data
            })
    }
};

export const logAPI = {
    getLog(gameNumber) {
        return instance.get(`log/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    postLog(gameNumber, newLogItem) {
        return instance.post(`log/${gameNumber}`, {newLogItem})
            .then(responce => {
                return responce.data
            })
    },
    deleteLog(gameNumber, deletedItem) {
        return instance.put(`log/${gameNumber}`, {deletedItem})
            .then(responce => {
                return responce.data
            })
    },
    postTempLog(gameNumber, newLogItem) {
        return instance.post(`log/temp/${gameNumber}`, {newLogItem})
            .then(responce => {
                return responce.data
            })
    },
    postConsLog(gameNumber, gamerId, teamType, newLogItem) {
        return instance.post(`log/cons/${gameNumber}`, {gamerId, teamType, newLogItem})
            .then(responce => {
                return responce.data
            })
    },
    deleteConsLog(gameNumber, deletedItem) {
        return instance.put(`log/cons/${gameNumber}`, {deletedItem})
            .then(responce => {
                return responce.data
            })
    }
};

export const gameAPI = {
    getGame(gameNumber) {
        return instance.get(`game/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    getSavedGames() {
        return instance.get(`savedGames`)
            .then(responce => {
                return responce.data
            })
    },
    createNewGame(gameName, gameNumber, gameType) {
        return instance.post(`game`, {gameName, gameNumber, gameType})
            .then(responce => {
                return responce.data
            })
    },
    getGameNumber() {
        return instance.get(`gameNumber`)
            .then(responce => {
                return responce.data
            })
    },
    putGameNumber(gameNumber) {
        return instance.put(`gameNumber`, {gameNumber})
            .then(responce => {
                return responce.data
            })
    }
};

export const tabloAPI = {
    getTime(gameNumber) {
        return instance.get(`time/${gameNumber}`)
            .then(responce => {
                return responce.data
            })
    },
    putTimerStatus(gameNumber, isRunning, timeDif,
                   timeMem, timeMemTimer, deadLine, period, smallOvertime, bigOvertime) {
        return instance.put(`time/isRunning/${gameNumber}`, {
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
        return instance.put(`time/isRunningTimeout/${gameNumber}`, {
            isRunning,
            timeDif,
            timeMem,
            timeMemTimer,
            deadLine
        })
    }
};
