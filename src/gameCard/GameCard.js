import React from "react";
import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@material-ui/core";
import GameMedia from "./GameMedia";

export default class GameCard extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick() {
        this.props.onSelect(this.props.gameRanking || 0, true);
    }

    onContextMenu(e) {
        e.preventDefault();
        this.props.onSelect(this.props.gameRanking || 0, false);
    }

    render() {
        return (
            <div className="game-card-container">
                <Card className="game-card" style={{maxWidth: "300px", height: "100%", verticalAlign: "top"}}>
                    <CardActionArea
                        onClick={this.onClick.bind(this)}
                        onContextMenu={this.onContextMenu.bind(this)}
                        style={{height: "100%"}}>
                        <div style={{height: "100%"}}>
                            <CardMedia
                                style={{width: "300px", height: "300px"}}
                                image={require(`../boxArt/${this.props.cardInfo.boxArtFile || 'default.jpg'}`) ||
                                       'default.jpg'}
                                gameRanking={this.props.gameRanking}
                                component={GameMedia}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {this.props.cardInfo.name || 'N/A'}
                                </Typography>
                                <Typography component="p">
                                    <strong>Estimated Play Time:</strong> {this.props.cardInfo.estimatedTime || 'N/A'}
                                </Typography>
                                <Typography component="p">
                                    <strong># of Players:</strong> {this.props.cardInfo.numPlayers || 'N/A'}
                                </Typography>
                                <Typography component="p">
                                    <strong>Rules Complexity:</strong> {this.props.cardInfo.rulesComplexity || 'N/A'}
                                </Typography>
                                <Typography component="p">
                                    <strong>Game Type:</strong> {this.props.cardInfo.type || 'N/A'}
                                </Typography>
                                <Typography component="p">
                                    <strong>Year:</strong> {this.props.cardInfo.year || 'N/A'}
                                </Typography>
                                <Typography component="p">
                                    <strong>BoardGameGeek.com Ranking:</strong> {this.props.cardInfo.bggRank || 'N/A'}
                                </Typography>
                                <Typography component="p">
                                    <strong>Description:</strong> {this.props.cardInfo.description || 'N/A'}
                                </Typography>
                                <Typography component="p">
                                    <strong># of People
                                        Interested:</strong> {this.props.cardInfo.interestedPlayers.length || 0}
                                </Typography>
                            </CardContent>
                        </div>
                    </CardActionArea>
                </Card>
            </div>
        );
    }
}
