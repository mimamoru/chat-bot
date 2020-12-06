import React, { useState, useCallback, useEffect } from 'react';
import List from '@material-ui/core/List';
import { Chat } from './index'
import { createStyles, makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(() =>
    createStyles({
        "chats": {
            height: "400px",
            padding: "0",
            overflow: "auto"
        }
    }),
);

const Chats = (props) => {
    const classes = useStyles();
    return (
        <List className={classes.chats}>
            {props.chats.map((e, i) => {
                return <Chat key={i.toString()} type={e.type} text={e.text} />
            })}
        </List>

    )
}


export default Chats;