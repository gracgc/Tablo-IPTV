import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import tabloReducer from "./tablo_reducer";
import teamsReducer from "./teams_reducer";
import logReducer from "./log_reducer";
import gamesReducer from "./games_reducer";
import {reducer as formReducer} from "redux-form";


let reducers = combineReducers({
    tabloPage: tabloReducer,
    teamsPage: teamsReducer,
    logPage: logReducer,
    gamesPage: gamesReducer,
    form: formReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers,  composeEnhancers(applyMiddleware(thunkMiddleware)));
window.__store__ = store;

export default store;
