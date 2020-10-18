import React, {useEffect} from 'react';
import './App.css';
import {Route, withRouter, Switch, Redirect } from "react-router-dom";
import {compose} from "redux";
import AdminPanel from "./components/ForAdmin/AdminPanel";
import Menu from "./components/MenuPanel/Menu/Menu";
import CreateGame from "./components/MenuPanel/CreateGame/CreateGame";
import CreateTeams from "./components/MenuPanel/CreateTeams/CreateTeams";
import SavedGames from "./components/MenuPanel/SavedGames/SavedGames";
import Settings from "./components/MenuPanel/Settings/Settings";




function App() {

    return (
        <div className='app'>
            <Switch>
                <Route exact path='/'
                       render={() => <Redirect to={"/menu"}/>}/>
                {/*<Route exact path='/adminPanel'*/}
                {/*       render={() => <Redirect to={"/menu"}/>}/>*/}
                <Route path='/menu' render={() => <Menu/>}/>
                <Route path='/createGame' render={() => <CreateGame/>}/>
                <Route path='/createTeams' render={() => <CreateTeams/>}/>
                <Route exact path='/adminPanel/:gameNumber?'
                       render={() => <AdminPanel/>}/>
                <Route path='/savedGames' render={() => <SavedGames/>}/>
                <Route path='/settings' render={() => <Settings/>}/>
            </Switch>
        </div>
    )
}

export default compose(withRouter) (App);
