import React from "react";
import _ from 'lodash';
import {Dialog, DialogContent, DialogTitle} from '@material-ui/core';
import {List, ListItem, ListItemText} from "@material-ui/core";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {IconButton, Paper, Typography} from "@material-ui/core";
import {Edit, Delete} from "@material-ui/icons";
import {ArrowUpward, ArrowDownward} from '@material-ui/icons';

export default class ResultsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentlyEditingRow: undefined,
            sortByRowId: 'interestedPlayers.length',
            sortAscending: false
        };
    }

    generateRows() {
        let rows = [];
        let gameList = this.props.gameMappings.gameList.map((game, index) => {
            game.key = index;
            return game;
        });
        gameList = _.sortBy(gameList, [this.state.sortByRowId]);
        if (!this.state.sortAscending) gameList = _.reverse(gameList);
        gameList.forEach(gameInfo => {
            const playersList = gameInfo.interestedPlayers.map(player => player.username + " (" + player.ranking + ")")
                                    .join(', ') || "";
            rows.push({
                id: gameInfo.key,
                gameName: gameInfo.name,
                playersAllowed: gameInfo.numPlayers,
                numInterested: gameInfo.interestedPlayers.length,
                namesInterested: playersList
            });
        });
        return rows;
    }

    renderRowDialog(row) {
        return (
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={this.state.currentlyEditingRow == row.id}
                onClose={() => this.setState({currentlyEditingRow: undefined})}
            >
                <DialogTitle>Edit player list: <strong>{row.gameName}</strong></DialogTitle>
                <DialogContent>
                    {this.props.gameMappings.gameList[row.id].interestedPlayers.length > 0
                        ? <List dense={true}>
                            {this.props.gameMappings.gameList[row.id].interestedPlayers.map((user, playerIndex) => {
                                return (
                                    <ListItem key={playerIndex}>
                                        <ListItemText>{user.username}</ListItemText>
                                        <IconButton aria-label="Delete"
                                                    onClick={async () => await this.props.deleteUserFromGame(
                                                        playerIndex, row.id, user.id,
                                                        this.props.gameMappings.gameList[row.id].id)}>
                                            <Delete/>
                                        </IconButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                        : <Typography>No users to display.</Typography>
                    }
                </DialogContent>
            </Dialog>
        );
    }

    onEditButtonClicked(rowId) {
        this.setState({currentlyEditingRow: rowId});
    }

    setSortRowInfo(rowId) {
        if (rowId === this.state.sortByRowId) this.setState({sortAscending: !this.state.sortAscending});
        else this.setState({sortByRowId: rowId, sortAscending: true});
    }

    renderSortIcon(rowId) {
        if (this.state.sortByRowId === rowId) {
            if (this.state.sortAscending) return <ArrowUpward style={{"fontSize": "12px"}}/>;
            else return <ArrowDownward style={{"fontSize": "12px"}}/>;
        }
    }

    render() {
        const rowsToDisplay = this.generateRows();
        return (
            <div className="results-page-container">
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    onClick={() => this.setSortRowInfo('name')}>Game {this.renderSortIcon(
                                    'name')}</TableCell>
                                <TableCell onClick={() => this.setSortRowInfo('numPlayers')}>Players
                                    Allotted {this.renderSortIcon('numPlayers')}</TableCell>
                                <TableCell onClick={() => this.setSortRowInfo('interestedPlayers.length')}># of People
                                    Interested {this.renderSortIcon('interestedPlayers.length')}</TableCell>
                                <TableCell>List of People Interested (with ranking #)</TableCell>
                                {this.props.loginAsOrganizer ? <TableCell>EDIT</TableCell> : null}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rowsToDisplay.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.gameName || ''}
                                    </TableCell>
                                    <TableCell>{row.playersAllowed || ''}</TableCell>
                                    <TableCell>{row.numInterested || 0}</TableCell>
                                    <TableCell>{row.namesInterested || ''}</TableCell>
                                    {this.props.loginAsOrganizer ? (
                                        <TableCell width={100}>
                                            <IconButton aria-label="Edit"
                                                        onClick={() => this.onEditButtonClicked(row.id)}>
                                                <Edit/>
                                            </IconButton>
                                            {this.renderRowDialog(row)}
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}
