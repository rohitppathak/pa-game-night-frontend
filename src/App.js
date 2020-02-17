import React from "react";
import axios from "axios";
import _ from "lodash";
import {Button} from "@material-ui/core";
import ParticipantApp from "./ParticipantApp";
import OrganizerApp from "./OrganizerApp";
import env from "./env.json";
import {w3cwebsocket as W3WebSocket} from 'websocket';

import "./App.css";

const socket = new W3WebSocket(`ws://${env.HOST}`);

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameMappings: {
                gameList: [],
                userList: []
            },
            loginAsOrganizer: false
        };
    }

    async componentDidMount() {
        this.setupSocket();
    }

    setupSocket() {
        socket.onopen = () => {
            console.log("WebSocket Client Connect");
        };
        socket.onmessage = async (message) => {
            const gameMappings = JSON.parse(message.data);
            this.setState({gameMappings: {gameList: gameMappings.gamesData, userList: gameMappings.users}});
        }
    }

    async updateGameMappings(userSelections, userName) {
        await axios.post(`http://${env.HOST}/games`, {userSelections, userName});
    }

    async removeUser(userName) {
        await axios.delete(`http://${env.HOST}/users/${userName}`);
    }

    async deleteUserFromGame(playerIndex, gameIndex, userId, gameId) {
        _.pullAt(this.state.gameMappings.gameList[gameIndex].interestedPlayers, playerIndex);
        this.setState({gameMappings: this.state.gameMappings});
        await axios.delete(`http://${env.HOST}/games/${gameId}/users/${userId}`);
    }

    async addGame(gameObject) {
        this.state.gameMappings.gameList.push(gameObject);
        await axios.put(`http://${env.HOST}/games`, gameObject);
    }

    render() {
        return (
            <div className="app-container">
                <div className="app-header">
                    <h3>Welcome to PA Game Night!</h3>
                </div>
                {this.state.loginAsOrganizer
                    ? <OrganizerApp
                        gameMappings={this.state.gameMappings}
                        removeUser={this.removeUser.bind(this)}
                        deleteUserFromGame={this.deleteUserFromGame.bind(this)}
                        addGame={this.addGame.bind(this)}
                    />
                    : <ParticipantApp
                        gameMappings={this.state.gameMappings}
                        updateGameMappings={this.updateGameMappings}
                        deleteUserFromGame={this.deleteUserFromGame.bind(this)}
                    />
                }
                <footer className="viewSwitchButtonFooter">
                    <Button className="button viewSwitchButton" color="primary"
                            onClick={() => this.setState({loginAsOrganizer: !this.state.loginAsOrganizer})}>
                        {this.state.loginAsOrganizer ? "PARTICIPANT VIEW" : "ORGANIZER VIEW"}
                    </Button>
                </footer>
            </div>
        );
    }
}
