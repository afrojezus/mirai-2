// TODO: Fix every single eslint-airbnb issue
import Typography from 'material-ui/Typography';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Grid from 'material-ui/Grid';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import { grey } from 'material-ui/colors';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import colorizer from '../utils/colorizer';
import checklang from '../checklang';
import strings from '../strings.json';
import { connect } from 'react-redux';
import { firebaseConnect, firebase } from 'react-redux-firebase';
import { history } from '../store';
import miraiIcon from '../assets/mirai-icon.png';
import { scrollFix } from './../utils/scrollFix';
import Switch from 'material-ui/Switch';
import { FormGroup, FormControlLabel } from 'material-ui/Form';

const styles = (theme) => ({
  root: {
    paddingTop: theme.spacing.unit * 8,
  },
  divider: {
    width: '100%',
  },
  spacing: {
    flex: 1,
  },
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 24,
    maxWidth: 1200,
    flexDirection: 'column',
  },
  title: {
    margin: 'auto',
    paddingBottom: 24,
  },
  formTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    margin: 'auto',
    paddingBottom: 12,
  },
  loginForm: {
    maxHeight: 300,
    minWidth: 400,
    margin: 'auto',
    background: grey[800],
    border: '2px solid rgba(255,0,0,0)',
    transition: theme.transitions.create(['border']),
  },
  textField: {
    width: '100%',
    marginBottom: 12,
  },
  ripple: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
    objectFit: 'cover',
    opacity: 0.1,
    filter: 'hue-rotate(310deg)',
  },
  ripplecon: {
    position: 'fixed',
    overflow: 'hidden',
    height: '100vh',
    width: '100%',
    pointerEvents: 'none',
    zIndex: -2,
  },
});

class Setup extends Component {
  state = {
    mode: 'login',
    email: '',
    password: '',
    error: '',
    lang: strings.enus,
  };

  componentWillMount = () => {
    checklang(this);
    scrollFix();
  };

  toggleLoginMode = () =>
    this.setState({
      mode: this.state.mode.includes('login') ? 'signup' : 'login',
    });

  login = () =>
    this.props.firebase
      .login({ email: this.state.email, password: this.state.password })
      .then((e) => {
        history.push('/');
      })
      .catch((error) =>
        this.setState({ error: error.message }, () =>
          setTimeout(() => {
            this.setState({ error: '' });
          }, 2000),
        ),
      );

  // TODO: Make sure you can do this with createUser() instead; also redux seem to suck at this.
  signup = () =>
    this.props.firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userData) => {
        // console.log(userData);
        this.props.firebase
          .database()
          .ref('/users')
          .child(userData.uid)
          .update({
            username: `Anon`,
            headers: '',
            avatar:
              'https://firebasestorage.googleapis.com/v0/b/yura-a8e86.appspot.com/o/userData%2Favatar%2Fstock%2Fmirai-icon.png?alt=media&token=56972279-adea-4ad9-a79e-6aa6a964bf61',
            nick: "Hi, I'm new here",
            motto: '',
            email: userData.email,
            userID: userData.uid,
            role: 'Normal',
            isDeveloper: false,
            noMine: true,
            willLog: true,
          })
          .then(() => {
            history.push('/wizard');
          });
      })
      .catch((error) =>
        this.setState({ error: error.message }, () =>
          setTimeout(() => {
            this.setState({ error: '' });
          }, 2000),
        ),
      );

  // TODO: Facebook login
  render() {
    const { classes } = this.props;
    const { mode, error, email, password, lang } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={0} className={classes.container}>
          <img src={miraiIcon} className="floatingIconMirai" alt="" />
          <Typography variant="title" className={classes.title}>
            {mode.includes('login') ? 'Mirai' : lang.setup.welcome}
          </Typography>
          <Card
            className={classes.loginForm}
            style={error !== '' ? { borderColor: 'rgba(255,0,0,.7)' } : null}>
            <CardContent>
              <Typography variant="title" className={classes.formTitle}>
                {error !== ''
                  ? error
                  : mode.includes('login') ? 'Login' : 'Sign up'}
              </Typography>
              <form>
                <TextField
                  autoFocus
                  onChange={(e) => this.setState({ email: e.target.value })}
                  label={lang.setup.email}
                  className={classes.textField}
                  type="email"
                  autoComplete="username"
                />
                <TextField
                  onChange={(e) => this.setState({ password: e.target.value })}
                  label={lang.setup.password}
                  className={classes.textField}
                  type="password"
                  autoComplete="current-password"
                />
              </form>
              <div className={classes.spacing} />
            </CardContent>
            <Divider className={classes.divider} />
            <CardActions>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode.includes('login') ? false : true}
                    onChange={this.toggleLoginMode}
                  />
                }
                label={'New?'}
              />
              <div className={classes.divider} />
              {email && password ? (
                <div>
                  {mode.includes('login') ? (
                    <Button
                      color="primary"
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={this.login}>
                      {lang.setup.access}
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={this.signup}>
                      {lang.setup.divein}
                    </Button>
                  )}
                </div>
              ) : null}
            </CardActions>
          </Card>
        </Grid>
      </div>
    );
  }
}

export default firebaseConnect()(
  connect(({ firebase: { auth, profile } }) => ({ auth, profile }))(
    withStyles(styles, { withTheme: true })(Setup),
  ),
);
