import React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@material-ui/core";
import axios from "axios";
import env from "./env";

import "./App.css"

export default class MatchUsersDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameList: [],
            unmatchedUsers: [],
            loading: true
        }
    }

    componentDidMount() {
        axios.get(`https://${env.HOST}/matchUsers`).then(res => {
            const {gameList, unmatchedUsers} = res.data;
            this.setState({
                gameList,
                unmatchedUsers,
                loading: false
            });
        });
    }


    render() {
        const gameList = this.state.gameList.filter(game => game.assignedPlayers.length);
        return (
            <Dialog fullWidth={true} maxWidth={"sm"} open={this.props.open} onClose={this.props.onClose}>
                <DialogTitle>Match Users result:</DialogTitle>
                <DialogContent>
                    {this.state.loading ? <Typography>Loading...</Typography> :
                    [gameList.length > 0
                        ? <List dense={true} key={0}>
                            {gameList.map((game, index) => (
                                <div key={index}>
                                    <ListItem>
                                        <ListItemText className={"primary"}>
                                            <Typography
                                                style={game.assignedPlayers.length < game.minPlayers ?
                                                    {"color": "#fdd835"} : {"color": "#1b5e20"}}
                                                variant={"h5"}>
                                                {game.name}
                                                {game.assignedPlayers.length < game.minPlayers && " -- not enough" +
                                                 " players!"}
                                            </Typography>
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        {game.assignedPlayers.map((user, index) =>
                                            <ListItemText key={index}>{user.username}</ListItemText>
                                        )}
                                    </ListItem>
                                </div>
                            ))}
                            {this.state.unmatchedUsers.length ?
                                <div className={"unmatchedUsersContainer"}>
                                    <ListItem>
                                        <ListItemText className={"primary"}>
                                            <Typography color='error' variant={"h5"}>{"Unmatched users: "}</Typography>
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        {this.state.unmatchedUsers.map((user, index) =>
                                            <ListItemText key={index}>{user.username}</ListItemText>
                                        )}
                                    </ListItem>
                                </div> : ""}
                        </List>
                        : <Typography>No games to match.</Typography>
                    ]}
                </DialogContent>
            </Dialog>
        );
    }
}
