import React, {useEffect, useState} from "react";
import c from './Video.module.css'
import c1920 from './Video_1920.module.css'
import Button from "@material-ui/core/Button";
import {useDispatch, useSelector} from "react-redux";
import {tabloAPI} from "../../../api/api";
import socket from "../../../socket/socket";
import {getTeams, setTeamsAC} from "../../../redux/teams_reducer";

const axios = require('axios');


const Video = (props) => {


    let width = window.innerWidth

    const dispatch = useDispatch();

    let [logo, setLogo] = useState()

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    const homeTeamLogo = teams.find(t => t.teamType === 'home').logo;

    const guestsTeamlogo = teams.find(t => t.teamType === 'guests').logo;

    useEffect(() => {
        dispatch(getTeams(1));

        socket.on(`getTeams${1}`, teams => {
                dispatch(setTeamsAC(teams))
            }
        )
    }, []);


    let uploadLogo = (file) => {

        let formData = new FormData;

        formData.append('file', file)

        axios.post('/api/teams/homeLogo/1', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                console.log(response)
            })
    }


    return (
        <div
            className={width === 1920 ? c1920.video : c.video}
        >
            <Button
                variant="contained"
                component="label"
            >
                Добавить лого
                <input
                    type="file"
                    hidden
                    enctype="multipart/form-data"
                    onChange={(e) => uploadLogo(e.target.files[0])}
                />
            </Button>
            <img src={homeTeamLogo} alt=""/>
            <img src={guestsTeamlogo} alt=""/>
        </div>
    )
}

export default Video;