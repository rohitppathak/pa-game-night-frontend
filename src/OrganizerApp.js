import React from "react";
import {Button, Typography} from "@material-ui/core";
import ResultsPage from "./pages/ResultsPage";
import AddGamesDialog from './AddGamesDialog';
import MatchUsersDialog from './MatchUsersDialog'
import {EditUsersDialog} from "./EditUsersDialog";

export default class OrganizerApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {openDialog: undefined};
    }

    onDialogClose() {
        this.setState({openDialog: undefined});
    }

    render() {
        return (
            <div className="organizer-content">
                <Typography># of participants: {this.props.gameMappings.userList.length}</Typography>
                <ResultsPage
                    gameMappings={this.props.gameMappings}
                    loginAsOrganizer={true}
                    deleteUserFromGame={async (userIndex, gameIndex, userId,
                                               gameId) => await this.props.deleteUserFromGame(userIndex, gameIndex,
                        userId, gameId)}
                />
                <div className="edit-controls">
                    <Button className="button" variant="outlined" color="secondary"
                            onClick={() => this.setState({openDialog: "editUsers"})}>Edit Users</Button>
                    <Button className="button" variant="outlined" color="secondary"
                            onClick={() => this.setState({openDialog: "addGames"})}>Add Games</Button>
                    <Button className="button" variant="outlined" color="secondary"
                            onClick={() => this.setState({openDialog: "matchUsers"})}>Match Users</Button>
                    {this.renderDialog(this.state.openDialog)}
                </div>
            </div>
        );
    }

    renderDialog(openDialog) {
        switch (openDialog) {
            case 'editUsers':
                return (
                    <EditUsersDialog
                        onClose={() => this.onDialogClose()}
                        open={true}
                        onRemoveUser={userName => this.props.removeUser(userName)}
                        userList={this.props.gameMappings.userList}
                    />
                );
            case 'addGames':
                return (
                    <AddGamesDialog
                        onClose={() => this.onDialogClose()}
                        open={true}
                        onAddGame={this.props.addGame}
                    />
                );
            case 'matchUsers':
                return (
                    <MatchUsersDialog
                        onClose={() => this.onDialogClose()}
                        open={true}
                    />
                );
            case undefined:
                return null;
        }
    }
}
