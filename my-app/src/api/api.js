import * as axios from "axios";


const instance = axios.create({
    withCredentials: true,
    baseURL: `http://localhost:5000/api/`,
});

export const teamsAPI = {
    getTeams() {
        return instance.get(`teams`)
            .then(responce => {
                return responce.data
            })
    },
};
