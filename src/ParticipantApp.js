import React from 'react';
import {Button, Step, Stepper, StepLabel, TextField} from '@material-ui/core';
import GameCard from './gameCard/GameCard';
import ResultsPage from './pages/ResultsPage';
import ParticipantAppService from './ParticipantAppService';

import axios from 'axios';
import env from "./env.json";

import "./ParticipantApp.css";

export default class ParticipantApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            errorMessage: null,
            userName: null,
            userSelections: {}
        };
        this.steps = ['Register', 'Select Games', 'Results'];

        for (let func in ParticipantAppService) this[func] = ParticipantAppService[func].bind(this);
    }

    render() {
        return (
            <div className="participant-content">
                <Stepper activeStep={this.state.activeStep} alternativeLabel>
                    {this.steps.map(label => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {this.getStepperContent()}
            </div>
        )
    }

    renderLoginPage() {
        const checkExistingUserName = async () => {
            if (!this.state.userName || this.state.userName.trim() === '') {
                this.setState({
                    errorMessage: 'Name is required!'
                });
                return;
            }
            let response = await axios.get(`http://${env.HOST}/users/${this.state.userName}`);
            response = response.data;
            if (!response.success) {
                this.setState({errorMessage: 'Username not found!'});
            } else {
                this.setState({userSelections: response.userSelections});
                this.goToNextStep();
            }
        };

        const checkNewUserName = async () => {
            if (!this.state.userName || this.state.userName.trim() === '') {
                this.setState({
                    errorMessage: 'Name is required!'
                });
                return;
            }
            const response = await axios.post(`http://${env.HOST}/users/${this.state.userName}`);
            if (response.data === 'failure') this.setState({
                errorMessage: 'A user with that' +
                              ' name' +
                              ' already' +
                              ' exists! Consider adding extra symbols to make it unique!'
            });
            else this.goToNextStep();
        };

        return (
            <div className="landing-page-container">
                <div>Please provide your full name!</div>
                <TextField
                    className="nameField"
                    required
                    margin="normal"
                    variant="outlined"
                    onChange={event => this.setState({userName: event.target.value})}
                />
                {this.renderStepperControls(checkExistingUserName, checkNewUserName)}
            </div>
        );
    }

    renderSelectionPage() {
        const checkSelections = () => {
            const userRankings = Object.values(this.state.userSelections);
            if ((userRankings.length === 1 && userRankings.includes(1))
                || (userRankings.length === 2 && userRankings.includes(1) && userRankings.includes(2))
                || (userRankings.length === 3 && userRankings.includes(1) && userRankings.includes(
                    2) && userRankings.includes(3))) {
                this.submitInfo();
                this.goToNextStep();
            } else this.setState(
                {
                    errorMessage: 'Users must select one, two, or three games, numbering their preferences ' +
                                  'sequentially starting from 1.'
                });
        };

        const resetFields = () => {
            this.setState({userName: null, userSelections: {}});
            this.goToPrevStep();
        };

        return (
            <div className="selection-page-container">
                <div className="grid-container">
                    {this.props.gameMappings.gameList.map((gameInfo) => {
                        return (
                            <GameCard
                                key={gameInfo.id}
                                onSelect={(gameRanking, increase) => this.onGameSelected(gameInfo.id, gameRanking, increase)}
                                cardInfo={gameInfo}
                                gameRanking={this.state.userSelections[gameInfo.id]}
                            />
                        );
                    })}
                </div>
                {this.renderStepperControls(checkSelections, resetFields)}
            </div>
        );
    }

    renderEndPage() {
        return (
            <div className="submission-page-container">
                <p>Successfully Submitted!</p>
                <ResultsPage
                    gameMappings={this.props.gameMappings}
                    loginAsOrganizer={false}
                    deleteUserFromGame={async (userIndex, gameIndex, userId, gameId) =>
                        await this.props.deleteUserFromGame(userIndex, gameIndex, userId, gameId)}
                />
                <Button className="button" variant="contained" color="primary" onClick={this.restartApp}>
                    RESTART AS NEW PARTICIPANT
                </Button>
            </div>
        )
    }

    renderStepperControls(moveForward, moveBackward) {
        const checkAndMoveForward = () => {
            this.setState({errorMessage: null});
            moveForward();
        };

        const checkAndMoveBackward = () => {
            this.setState({errorMessage: null});
            moveBackward();
            //this.goToPrevStep();
        };

        return (
            <div className={`stepper-controls stepper-controls-${this.state.activeStep}`}>
                <p style={{color: 'red'}}>{this.state.errorMessage ? `Error: ${this.state.errorMessage}` : null}</p>
                <Button
                    className={"button"}
                    variant="contained"
                    color="inherit"
                    //disabled={this.state.activeStep === 0 || this.state.activeStep === this.steps.length - 1}
                    onClick={checkAndMoveBackward}
                >
                    {this.state.activeStep ? 'PREV' : 'New User'}
                </Button>
                <Button
                    className="button"
                    variant="contained"
                    color="primary"
                    disabled={this.state.activeStep === this.steps.length - 1}
                    onClick={checkAndMoveForward}
                > {}
                    {this.state.activeStep === this.steps.length - 2 ? 'SUBMIT' : 'EXISTING USER'}
                </Button>
            </div>
        );
    }
}
