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
import {Delete} from "@material-ui/icons";

function EditUsersDialog(props) {
    return (
        <Dialog fullWidth={true} maxWidth={"sm"} open={props.open} onClose={props.onClose}>
            <DialogTitle>Edit user list:</DialogTitle>
            <DialogContent>
                {props.userList.length > 0
                    ? <List dense={true}>
                        {props.userList.map((userName, index) => (
                            <ListItem key={index}>
                                <ListItemText>{userName}</ListItemText>
                                <IconButton aria-label="Delete"
                                            onClick={async () => await props.onRemoveUser(userName)}>
                                    <Delete/>
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    : <Typography>No users to display.</Typography>
                }
            </DialogContent>
        </Dialog>
    );
}

export {EditUsersDialog};
