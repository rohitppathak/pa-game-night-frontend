import React from "react";
import {Checkbox} from "@material-ui/core";
import {Row} from "simple-flexbox";
import {CropSquare, LooksOne, LooksTwo, Looks3} from '@material-ui/icons';

export default class GameMedia extends React.Component {
    constructor(props) {
        super(props);
    }

    iconSelection() {
        if (this.props.gameRanking === 1) return <LooksOne/>
        else if (this.props.gameRanking === 2) return <LooksTwo/>
        else if (this.props.gameRanking === 3) return <Looks3/>
        else return <CropSquare/>
    }

    render() {
        return (
            <div className={"cardImage"} style={this.props.style} image={this.props.image}>
                <Row>
                    <div style={{flex: 1}}/>
                    <Checkbox className={"selectCheckbox"} checked={true}
                              icon={<CropSquare/>}
                              checkedIcon={this.iconSelection()}/>
                </Row>
            </div>
        );
    }
}
