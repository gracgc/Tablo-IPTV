import * as axios from "axios";



export const teamsAPI = {
    getTeams() {
        return axios.get(`http://localhost:5000/api/teams`)
            .then(responce => {
                return responce.data
            })
    }
};

export const logAPI = {
    getLog() {
        return axios.get(`http://localhost:5000/api/log`)
            .then(responce => {
                return responce.data
            })
    },
    postLog(newLog) {
        return axios.post(`http://localhost:5000/api/log`, {item: newLog})
            .then(responce => {
                return responce.data
            })
    }
};
