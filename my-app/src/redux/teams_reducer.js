import {teamsAPI} from "../api/api";

const ADD_GOAL = 'teams/ADD_GOAL';
const CHANGE_GAMER_STATUS = 'teams/CHANGE_GAMER_STATUS';
const ADD_GAMER_GOAL = 'teams/ADD_GAMER_GOAL';
const SET_TEAMS = 'teams/SET_TEAMS';


let initialState = {
    teams: [
        {
            name: 'Home',
            counter: 0,
            teamType: 'home',
            timeOut: 0,
            gamers: [
                {
                    id: 1,
                    fullName: 'Gamer 1',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 2,
                    fullName: 'Gamer 2',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 3,
                    fullName: 'Gamer 3',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 4,
                    fullName: 'Gamer 4',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 5,
                    fullName: 'Gamer 5',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 6,
                    fullName: 'Gamer 6',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 7,
                    fullName: 'Gamer 7',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 8,
                    fullName: 'Gamer 8',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 9,
                    fullName: 'Gamer 9',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 10,
                    fullName: 'Gamer 10',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 11,
                    fullName: 'Gamer 11',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 12,
                    fullName: 'Gamer 12',
                    status: 'in game',
                    goals: 0
                }
            ]
        },
        {
            name: 'Guests',
            counter: 0,
            teamType: 'guests',
            timeOut: 0,
            gamers: [
                {
                    id: 1,
                    fullName: 'Gamer 1',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 2,
                    fullName: 'Gamer 2',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 3,
                    fullName: 'Gamer 3',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 4,
                    fullName: 'Gamer 4',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 5,
                    fullName: 'Gamer 5',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 6,
                    fullName: 'Gamer 6',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 7,
                    fullName: 'Gamer 7',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 8,
                    fullName: 'Gamer 8',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 9,
                    fullName: 'Gamer 9',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 10,
                    fullName: 'Gamer 10',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 11,
                    fullName: 'Gamer 11',
                    status: 'in game',
                    goals: 0
                },
                {
                    id: 12,
                    fullName: 'Gamer 12',
                    status: 'in game',
                    goals: 0
                }
            ]
        }
    ]
    // teams: []
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
export const changeGamerStatusAC = (gamerId, teamType) => ({type: CHANGE_GAMER_STATUS, gamerId, teamType});
export const addGamerGoalAC = (gamerId, teamType, symbol) => ({type: ADD_GAMER_GOAL, gamerId, teamType, symbol});

export const getTeams = () => async (dispatch) => {
    let response = await teamsAPI.getTeams();
    dispatch(setTeamsAC(response.data.teams));
};


export default teamsReducer;
