import React from 'react';
import {createStyles, Grow, makeStyles, Theme, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        _title: {
            fontWeight: 700,
            fontFamily: `Raleway, 'sans-serif'`,
            letterSpacing: 10,
        }
    })
)

interface Loader {
    loading: boolean;
}

export default ({loading}: Loader) => {
    const classes = useStyles();
    return (
        <div>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <Grow in={loading}><Typography variant='h4' className={classes._title}>
                    MIRAI
                </Typography></Grow>
            </div>
        </div>
    );
};