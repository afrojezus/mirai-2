import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { IRouteComponent } from '../globalInterfaces';
import globalStyles from '../globalStyles';

// Local MUI styles for the route.
const styles = (theme: any) => ({
  title: {
    fontWeight: 700
  },
  searchMargin: {
    paddingTop: theme.spacing.unit
  },
  // ...load the global styles as well
  ...globalStyles(theme)
});

class Settings extends React.Component<IRouteComponent> {
  public render() {
    const { classes } = this.props;
    return (
      <main className="routeContainer">
        <Grid container={true} className={classes.grid}>
          <Grid item={true} xs={'auto'} className={classes.bannerToolbarBG} />
          <div className={classes.innerMargin}>
            <Grid item={true} xs={'auto'} className={classes.section}>
              <Typography className={classes.sectionTitle} variant="title">
                Ongoing
              </Typography>
              <Grid
                className={classes.sectionGrid}
                container={true}
                spacing={8}
              >
                <Grid item={true}>
                  <Card>
                    <CardMedia />
                    <CardContent>
                      <Typography variant="title">A</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item={true}>
                  <Card>
                    <CardMedia />
                    <CardContent>
                      <Typography variant="title">B</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item={true}>
                  <Card>
                    <CardMedia />
                    <CardContent>
                      <Typography variant="title">C</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Divider style={{ margin: '32px 0' }} />
            <Grid item={true} xs={'auto'} className={classes.section}>
              <Grid
                className={classes.sectionGrid}
                container={true}
                spacing={8}
              />
            </Grid>
          </div>
        </Grid>
      </main>
    );
  }
}

export default compose(
  firestoreConnect()(
    connect(({ mir }: any) => ({
      mir
    }))(withStyles(styles as any)(Settings))
  )
);
