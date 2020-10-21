import {teamsAPI} from "../api/api";

const ADD_GOAL = 'teams/ADD_GOAL';
const CHANGE_GAMER_STATUS = 'teams/CHANGE_GAMER_STATUS';
const ADD_GAMER_GOAL = 'teams/ADD_GAMER_GOAL';
const SET_TEAMS = 'teams/SET_TEAMS';


let initialState = {
    teams: [
        {
            name: 'Name',
            counter: 0,
            teamType: 'home',
            timeOut: 0,
            gamers: [
                {
                    id: 1,
                    fullName: 'Gamer 1',
                    status: 'in game',
                    goals: 0
                }
            ]
        },
        {
            name: 'Name',
            counter: 0,
            teamType: 'guests',
            timeOut: 0,
            gamers: [
                {
                    id: 1,
                    fullName: 'Gamer 1',
                    status: 'in game',
                    goals: 0
                }
            ]
        }
    ]
};

const teamsReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_TEAMS:
            return {
                ...state,
                teams: action.teams
            };

        case ADD_GOAL:
            return {
                ...state,
                teams: state.teams.map(t => {
                    if (t.teamType === action.teamType) {
                        return {...t, counter: t.counter + 1}
                    }
                    return t;
                })
            };

        case CHANGE_GAMER_STATUS:
            return {
                ...state,
                teams: state.teams.map(t => {
                        if (t.teamType === action.teamType) {
                            return {
                                ...t, gamers: t.gamers.map(g => {
                                    if (g.id === action.gamerId) {
                                        if (g.status === 'in game') {
                                            return {...g, status: 'deleted'}
                                        }
                                        if (g.status === 'deleted') {
                                            return {...g, status: 'in game'}
                                        }

                                    }
                                    return g;
                                })
                            }
                        }
                        return t;
                    }
                )
            };

        case ADD_GAMER_GOAL:
            return {
                ...state,
                teams: state.teams.map(t => {
                        if (t.teamType === action.teamType) {
                            return {
                                ...t, gamers: t.gamers.map(g => {
                                    if (g.id === action.gamerId) {
                                        if (action.symbol === '+') {
                                            return {...g, goals: g.goals + 1}
                                        }
                                        if (action.symbol === '-') {
                                            if (g.goals > 0) {
                                                return {...g, goals: g.goals - 1}
                                            } else {
                                                return {...g}
                                            }
                                        }

                                    }
                                    return g;
                                })
                            }
                        }
                        return t;
                    }
                )
            };


        default:
            return state;
    }
};

export const setTeamsAC = (teams) => ({type: SET_TEAMS, teams});
export const addGoalAC = (teamType) => ({type: ADD_GOAL, teamType});
export const changeGamerStatusAC = (gamerId, teamType) => ({type: CHANGE_GAMER_STATUS, teamType, gamerId});
export const addGamerGoalAC = (gamerId, teamType, symbol) => ({type: ADD_GAMER_GOAL, teamType, gamerId, symbol});


export const getTeams = (gameNumber) => async (dispatch) => {
    let response = await teamsAPI.getTeams(gameNumber);
    dispatch(setTeamsAC(response));
};

export const gamerGoal = (gameNumber, teamType, id, symbol) => async (dispatch) => {
    let response = await teamsAPI.gamerGoal(gameNumber, teamType, id, symbol);
    if (response.resultCode === 0) {
        dispatch(addGamerGoalAC(teamType, id, symbol));
    }
};

export const changeGamerStatus = (gameNumber, teamType, id, gamerStatus) => async (dispatch) => {
    let response = await teamsAPI.gamerStatus(gameNumber, teamType, id, gamerStatus);
    if (response.resultCode === 0) {
        dispatch(changeGamerStatusAC(teamType, id));
    }
};


export default teamsReducer;
