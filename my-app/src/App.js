import React from 'react';
import './App.css';
import {Route, withRouter, Switch, Redirect } from "react-router-dom";
import {compose} from "redux";
import AdminPanel from "./components/ForAdmin/AdminPanel";
import Menu from "./components/MenuPanel/Menu/Menu";
import CreateGame from "./components/MenuPanel/CreateGame/CreateGame";
import SavedGames from "./components/MenuPanel/SavedGames/SavedGames";
import Settings01 from "./components/MenuPanel/Settings2/Settings01";
import TabloEditClient from "./components/ForClient/TabloEdit/TabloEditClient";





function App() {

    return (
        <div className='app'>
            <Switch>
                <Route exact path='/'
                       render={() => <Redirect to={"/menu"}/>}/>
                <Route exact path='/adminPanel'
                       render={() => <Redirect to={"/menu"}/>}/>
                <Route path='/menu' render={() => <Menu/>}/>
                <Route path='/createGame' render={() => <CreateGame/>}/>
                <Route exact path='/adminPanel/:gameNumber?'
                       render={() => <AdminPanel/>}/>
                <Route path='/savedGames' render={() => <SavedGames/>}/>
                <Route path='/settings' render={() => <Settings01/>}/>
                <Route path='/tabloClient/:gameNumber?' render={() => <TabloEditClient/>}/>
            </Switch>
        </div>
    )
}

export default compose(withRouter) (App);
