
import classnames from 'classnames';
import * as Icon from 'material-ui-icons';
import Button from 'material-ui/Button/Button';
import Chip from 'material-ui/Chip/Chip';
import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/grey';
import Divider from 'material-ui/Divider/Divider';
import Grid from 'material-ui/Grid/Grid';
import IconButton from 'material-ui/IconButton/IconButton';
import Input, { InputLabel } from 'material-ui/Input';
import Menu, { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper/Paper';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import LinearProgress from 'material-ui/Progress/LinearProgress';
import withStyles from 'material-ui/styles/withStyles';
import Tooltip from 'material-ui/Tooltip/Tooltip';
import Typography from 'material-ui/Typography/Typography';
import moment from 'moment';
import queryString from 'query-string';
import Component, { React } from 'react';
import FadeIn from 'react-fade-in';
import { connect } from 'react-redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

import CardButton, { PeopleButton } from '../components/cardButton';

import { MIR_PLAY_SHOW, MIR_SET_TITLE } from '../constants';
import { scrollFix } from './../utils/scrollFix';
import Anilist from '../anilist-api';
import {
  bigFuckingQueryM,
  bigFuckingQueryS,
  entryQuery,
  entryQueryM,
} from '../anilist-api/queries';
import checklang from '../checklang';
import {
  Column,
  CommandoBar,
  Container,
  Dialogue,
  Header,
  ItemContainer,
  LoadingIndicator,
  MainCard,
  Root,
  SectionTitle,
  TitleHeader,
} from '../components/layouts';
import { timeFormatter } from '../components/supertable';
import Kitsu from '../kitsu-api';
import strings from '../strings.json';
import Twist from '../twist-api';
import bigfuck from '../utils/bigfuck';
import Colorizer from '../utils/colorizer';
import TwistFilter from '../utils/filter';

const styles = theme => ({
  loading: {
    height: '100%',
    width: '100%',
    zIndex: 1200,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    padding: 0,
    margin: 'auto',
    color: 'white',
    transition: theme.transitions.create(['all']),
  },
  root: {
    paddingTop: theme.spacing.unit * 8,
    transition: theme.transitions.create(['all']),
    animation: 'load .3s ease',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 1500,
  },
  backToolbar: {
    marginTop: theme.spacing.unit * 8,
  },
  bigBar: {
    width: '100%',
    height: 'auto',
    boxShadow: '0 2px 24px rgba(0,0,0,.2)',
    background: '#111',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 8,
    transition: theme.transitions.create(['all']),
  },
  glassEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    height: '100vh',
    objectFit: 'cover',
    width: '100%',
    transform: 'scale(20)',
  },
  rootInactive: {
    opacity: 0,
    pointerEvents: 'none',
    transition: theme.transitions.create(['all']),
  },
  container: {
    padding: theme.spacing.unit * 3,
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  frame: {
    height: '100%',
    width: '100%',
    position: 'relative',
    transition: theme.transitions.create(['all']),
  },
  bgImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    height: '100vh',
    objectFit: 'cover',
    width: '100%',
    zIndex: -1,
    overflow: 'hidden',
    filter: 'brightness(.3)',
    transition: theme.transitions.create(['all']),
  },
  grDImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
    height: '100vh',
    width: '100%',
    zIndex: -1,
    overflow: 'hidden',
    transition: theme.transitions.create(['all']),
  },
  mainFrame: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      paddingTop: `${theme.spacing.unit * 8}px !important`,
    },
  },
  bigTitle: {
    fontWeight: 800,
    color: 'white',
    textShadow: '0 2px 12px rgba(0,0,0,.2)',
  },
  smallTitle: {
    fontWeight: 600,
    color: 'white',
    fontSize: theme.typography.pxToRem(16),
    textShadow: '0 2px 12px rgba(0,0,0,.17)',
  },
  tagBox: {
    marginTop: theme.spacing.unit,
  },
  tagTitle: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: 600,
    color: 'white',
    textShadow: '0 2px 12px rgba(0,0,0,.17)',
    marginBottom: theme.spacing.unit,
  },
  desc: {
    marginTop: theme.spacing.unit,
    color: 'white',
    textShadow: '0 0 12px rgba(0,0,0,.1)',
    marginBottom: theme.spacing.unit,
  },
  boldD: {
    color: 'white',
    textShadow: '0 0 12px rgba(0,0,0,.1)',
    fontWeight: 600,
  },
  smallD: {
    marginLeft: theme.spacing.unit / 2,
    color: 'white',
    textShadow: '0 0 12px rgba(0,0,0,.1)',
  },
  sepD: {
    display: 'flex',
    marginLeft: theme.spacing.unit / 2,
  },
  artworkimg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    background: 'white',
    transition: theme.transitions.create(['all']),
  },
  artwork: {
    maxWidth: 350,
    height: 400,
    margin: 'auto',
    borderRadius: 3,
    overflow: 'hidden',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.2))',
    transition: theme.transitions.create(['all']),
    position: 'relative',
    '&:hover': {
      overflow: 'initial',
      boxShadow: '0 2px 14px rgba(0,0,0,.3)',
      background: theme.palette.primary.main,
    },
    '&:hover > .artworktitle': {
      transform: 'translate(-50%,-50%) scale(1.2) translateZ(30%)',
    },
    '&:hover > img': {
      transform: 'scale(0.9)',
      filter: 'brightness(0.9)',
    },
    '&:active': {
      opacity: 0.7,
    },
    zIndex: 500,
  },
  artworkDisabled: {
    maxWidth: 300,
    height: 400,
    margin: 'auto',
    boxShadow: '0 3px 18px rgba(0,0,0,.5)',
    transition: theme.transitions.create(['all']),
    position: 'relative',
    '& > img': {
      opacity: 0.7,
    },
    zIndex: 500,
  },
  genreRow: {
    display: 'flex',
    margin: 'auto',
    marginBottom: theme.spacing.unit,
  },
  tagChip: {
    margin: theme.spacing.unit / 2,
    background: 'white',
    color: '#111',
    boxShadow: '0 2px 12px rgba(0,0,0,.17)',
  },
  secTitle: {
    padding: theme.spacing.unit,
    fontWeight: 700,
    fontSize: 22,
    zIndex: 'inherit',
    paddingBottom: theme.spacing.unit * 2,
  },
  fillImg: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    background: 'white',
    transition: theme.transitions.create(['all']),
  },
  peopleCard: {
    height: 'auto',
    width: 183,
    flexGrow: 'initial',
    flexBasis: 'initial',
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(['all']),
    '&:hover': {
      transform: 'scale(1.05)',
      overflow: 'initial',
      zIndex: 200,
      boxShadow: '0 2px 14px rgba(0,55,230,.3)',
      background: blue.A200,
    },
    '&:hover > * > h1': {
      transform: 'scale(1.1)',
      textShadow: '0 2px 12px rgba(0,0,0,.7)',
    },
    position: 'relative',
    overflow: 'hidden',
  },
  peopleImage: {
    height: 156,
    width: 156,
    margin: 'auto',
    zIndex: 1,
    borderRadius: '50%',
    boxShadow: '0 2px 12px rgba(0,0,0,.2)',
    transition: theme.transitions.create(['all']),
    '&:hover': {
      boxShadow: '0 3px 16px rgba(0,0,0,.5)',
    },
    top: 0,
    left: 0,
  },
  peopleCharImage: {
    height: 64,
    width: 64,
    margin: 'auto',
    zIndex: 2,
    position: 'absolute',
    borderRadius: '50%',
    boxShadow: '0 2px 12px rgba(0,0,0,.2)',
    transition: theme.transitions.create(['all']),
    '&:hover': {
      boxShadow: '0 3px 16px rgba(0,0,0,.5)',
      transform: 'scale(1.2)',
    },
    right: theme.spacing.unit * 3,
    bottom: theme.spacing.unit * 7,
  },
  entityContext: {
    '&:last-child': {
      paddingBottom: 12,
    },
  },
  peopleTitle: {
    fontSize: 14,
    fontWeight: 500,
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2,
    transition: theme.transitions.create(['transform']),
    bottom: 0,
    zIndex: 5,
    margin: 'auto',
    textAlign: 'center',
    textShadow: '0 1px 12px rgba(0,0,0,.2)',
  },
  peopleSubTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,.7)',
    fontWeight: 600,
    margin: 'auto',
    transition: theme.transitions.create(['transform']),
    zIndex: 5,
    textShadow: '0 1px 12px rgba(0,0,0,.2)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  entityCard: {
    height: 200,
    width: 183,
    flexGrow: 'initial',
    flexBasis: 'initial',
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(['all']),
    '&:hover': {
      transform: 'scale(1.05)',
      overflow: 'initial',
      zIndex: 200,
      boxShadow: '0 2px 14px rgba(0,55,230,.3)',
      background: blue.A200,
    },
    '&:hover > div': {
      boxShadow: 'none',
    },
    '&:hover > * > h1': {
      transform: 'scale(1.4)',
      fontWeight: 700,
      textShadow: '0 2px 12px rgba(0,0,0,.7)',
    },
    position: 'relative',
    overflow: 'hidden',
  },
  entityCardDisabled: {
    height: 200,
    width: 183,
    flexGrow: 'initial',
    flexBasis: 'initial',
    margin: theme.spacing.unit / 2,
    transition: theme.transitions.create(['all']),
    filter: 'brightness(.8)',
    position: 'relative',
    overflow: 'hidden',
  },
  entityImage: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    position: 'absolute',
    zIndex: -1,
    transition: theme.transitions.create(['filter']),
    '&:hover': {
      filter: 'brightness(0.8)',
    },
    top: 0,
    left: 0,
  },
  entityTitle: {
    fontSize: 14,
    fontWeight: 500,
    position: 'absolute',
    padding: theme.spacing.unit * 2,
    transition: theme.transitions.create(['transform']),
    bottom: 0,
    zIndex: 5,
    left: 0,
    textShadow: '0 1px 12px rgba(0,0,0,.2)',
  },
  entitySubTitle: {
    fontSize: 14,
    fontWeight: 600,
    position: 'absolute',
    padding: theme.spacing.unit * 2,
    transition: theme.transitions.create(['transform']),
    top: 0,
    left: 0,
    zIndex: 5,
    textShadow: '0 1px 12px rgba(0,0,0,.2)',
  },
  itemcontainer: {
    paddingBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  gradientCard: {
    position: 'relative',
    background: 'linear-gradient(to top, transparent, rgba(0,0,0,.6))',
    height: 183,
    width: '100%',
  },
  sectDivide: {
    marginTop: theme.spacing.unit * 2,
  },
  sectDivideDown: {
    marginBottom: theme.spacing.unit * 2,
  },
  progressCon: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 400,
    margin: 'auto',
  },
  progressTitle: {
    display: 'flex',
    fontSize: theme.typography.pxToRem(12),
    margin: 'auto',
    textAlign: 'center',
  },
  progressBar: {
    background: 'rgba(255,255,255,.3)',
    margin: theme.spacing.unit / 2,
  },
  progressBarActive: {
    background: 'white',
  },
  commandoBar: {
    width: '100%',
    display: 'inline-flex',
    boxSizing: 'border-box',
    background: '#222',
    borderBottom: '1px solid rgba(255,255,255,.1)',
  },
  commandoText: {
    margin: 'auto',
    textAlign: 'center',
  },
  commandoTextBox: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    margin: 'auto',
  },
  commandoTextBoxRow: {
    padding: theme.spacing.unit,
    margin: theme.spacing.unit,
    display: 'flex',
    boxShadow: 'none',
    border: '1px solid rgba(255,255,255,.1)',
    background: 'transparent',
  },
  commandoTextLabel: {
    fontSize: theme.typography.pxToRem(12),
    textAlign: 'center',
    color: 'rgba(255,255,255,.8)',
  },
  commandoTextLabelRow: {
    fontSize: theme.typography.pxToRem(14),
    color: 'white',
    margin: 'auto',
    paddingLeft: theme.spacing.unit,
  },
  commandoTextNumberRow: {
    color: 'rgba(0,0,0,1)',
    margin: 'auto',
    fontSize: theme.typography.pxToRem(32),
    fontWeight: 700,
  },
  smallTitlebar: {
    display: 'flex',
  },
  artworktype: {
    fontSize: theme.typography.pxToRem(16),
    boxSizing: 'border-box',
    padding: theme.spacing.unit,
    margin: 'auto',
    textAlign: 'center',
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,1)',
    fontWeight: 600,
    borderRadius: theme.spacing.unit / 2,
  },
  loadingArtwork: {
    margin: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    filter: 'drop-shadow(0 2px 16px rgba(0,0,0,.3))',
  },
  leftSide: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      flexBasis: 0,
      width: '100%',
    },
  },
  fabPlayButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
    zIndex: 10000,
    transform: 'translateZ(0)',
  },
  fabProgress: {
    color: 'white',
    zIndex: 10001,
    transition: theme.transitions.create(['all']),
  },
  fabWrapper: {
    transition: theme.transitions.create(['all']),
    margin: theme.spacing.unit,
    position: 'relative',
    zIndex: 10000,
  },
  fabContainer: {
    transition: theme.transitions.create(['all']),
    opacity: 0,
    zIndex: 10000,
  },
  playArtworkButtonContainer: {
    borderRadius: '50%',
    background: blue.A200,
    transform: 'translateZ(30%)',
  },
  playArtworkButton: {
    color: 'white',
    width: 32,
    height: 32,
  },
  selectForm: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  streamButton: {
    width: '100%',
    marginTop: theme.spacing.unit,
    animation: 'loadIn .5s ease',
  },
  epList: {
    maxHeight: 500,
    overflowY: 'auto',
  },
  epCard: {
    width: 48,
    borderRadius: '50%',
    boxSizing: 'border-box',
    height: 48,
    border: '2px solid transparent',
    fontWeight: 700,
    fontSize: theme.typography.pxToRem(18),
    boxShadow: theme.shadows[2],
  },
  epCardActive: {
    border: '2px solid white',
  },
  activeEpDot: {
    height: 2,
    width: 2,
    borderRadius: '50%',
    boxShadow: theme.shadows[3],
    background: 'white',
  },
  statusForm: {
    minWidth: 300,
    marginBottom: theme.spacing.unit * 3,
  },
});

class Show extends Component
{
  state = {
    data: {},
    tabVal: 0,
    loading: true,
    playerActive: false,
    id: 0,
    hue: '#111',
    hueVib: grey.A200,
    hueVibN: grey[900],
    eps: null,
    epError: false,
    menuEl: null,
    reportModal: false,
    status: '',
    lang: strings.enus,
    rVal: '',
    userlessREmail: '',
    showEpisodes: false,
    statusVal: '',
  };

  componentWillMount = () =>
  {
    scrollFix();
    checklang(this);
  };

  componentDidMount = async () =>
  {
    this.init();
  };

  componentWillReceiveProps = async (nextProps) =>
  {
    if (
      this.props.mir !== nextProps.mir &&
      this.state.data &&
      this.state.data.Media &&
      this.state.data.Media.type.includes('ANIME')
    )
    {
      await this.executeTwist();
    }
  };

  componentWillUnmount = () =>
  {
    this.props.sendTitleToMir('');
    document.title = 'Mirai';
    this.unlisten();
  };

  frame = document.getElementById('previewFrame');

  unlisten = this.props.history.listen((location) =>
  {
    const id = queryString.parse(location.search);
    if (location.pathname === '/show')
    {
      if ((id.s || id.m) !== this.state.id)
      {
        this.init();
        scrollFix();
      }
    }
    return false;
  });

  init = () =>
    this.setState(
      {
        data: null,
        loading: true,
        hue: '#111',
        hueVib: window.theme.palette.primary.main,
        hueVibN: window.theme.palette.primary.main,
        eps: null,
        epError: false,
      },
      async () =>
        setTimeout(async () =>
        {
          const superBar = document.getElementById('superBar');
          if (superBar) superBar.style.background = null;
          const id = queryString.parse(this.props.history.location.search);
          const data = this.props.history.location.search.includes('?s=99999999999')
            ? await this.props.firebase
              .database()
              .ref('/anime')
              .child('Cory')
              .once('value')
            : this.props.history.location.search.includes('?m=')
              ? await Anilist.get(entryQueryM, { id: id.m })
              : await Anilist.get(entryQuery, { id: id.s });
          try
          {
            if (data)
            {
              if (
                this.props.history.location.search.includes('?s=99999999999')
              )
              {
                const cory = await data.val();
                if (cory)
                {
                  this.setState(
                    {
                      data: {
                        Media: cory,
                      },
                      id: cory.id,
                      fav: this.props.history.location.search.includes('?s=')
                        ? !!(
                          this.props.profile.favs &&
                            this.props.profile.favs.show &&
                            this.props.profile.favs.show[id.s]
                        )
                        : !!(
                          this.props.profile.favs &&
                            this.props.profile.favs.manga &&
                            this.props.profile.favs.manga[id.m]
                        ),
                    },
                    () => this.pasta(),
                  );
                }
                else throw new Error('Cory fucked up.');
              }
              else
              {
                this.setState(
                  {
                    data: data.data,
                    id: data.data.Media.id,
                    fav: this.props.history.location.search.includes('?s=')
                      ? !!(
                        this.props.profile.favs &&
                          this.props.profile.favs.show &&
                          this.props.profile.favs.show[id.s]
                      )
                      : !!(
                        this.props.profile.favs &&
                          this.props.profile.favs.manga &&
                          this.props.profile.favs.manga[id.m]
                      ),
                  },
                  () => this.pasta(),
                );
              }
            }
            else throw new Error('Metadata error');
          }
          catch (error)
          {
            this.setState({ error: error.error }, () =>
              setTimeout(() => this.setState({ error: '' }), 3000));
          }
        }, 300),
    );

  pasta = async () =>
  {
    const data = this.state.data.Media;
    this.props.sendTitleToMir(data.title.romaji);
    document.title = `Mirai - ${data.title.romaji}`;

    const image = this.state.data.Media.bannerImage
      ? this.state.data.Media.bannerImage
      : this.state.data.Media.coverImage.large;

    const similarReq = {
      tag: data.tags && data.tags.length > 0 ? data.tags[0].name : null,
      sort: ['POPULARITY_DESC'],
      page: 1,
      isAdult: false,
    };

    const similarReq2 = {
      tag: data.tags && data.tags.length > 1 ? data.tags[1].name : null,
      sort: ['POPULARITY_DESC'],
      page: 1,
      isAdult: false,
    };

    const similars = data.type.includes('MANGA')
      ? await Anilist.get(bigFuckingQueryM, similarReq)
      : await Anilist.get(bigFuckingQueryS, similarReq);
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    if (
      this.props.profile.completed &&
      this.props.profile.completed[entity] &&
      this.props.profile.completed[entity][data.id]
    )
    {
      this.setState({ statusVal: 'c' });
    }

    if (
      this.props.profile.dropped &&
      this.props.profile.dropped[entity] &&
      this.props.profile.dropped[entity][data.id]
    )
    {
      this.setState({ statusVal: 'd' });
    }

    if (
      this.props.profile.episodeProgress &&
      this.props.profile.episodeProgress[data.id] &&
      !(
        this.props.profile.completed &&
        this.props.profile.completed[entity] &&
        this.props.profile.completed[entity][data.id]
      )
    )
    {
      this.setState({ statusVal: 'w' });
    }

    if (image)
    {
      Colorizer(`https://cors-anywhere.herokuapp.com/${image}`).then(pal =>
        this.setState(
          {
            hue: pal.DarkMuted && pal.DarkMuted.getHex(),
            hueVib: pal.LightVibrant && pal.LightVibrant.getHex(),
            hueVibN: pal.DarkVibrant && pal.DarkVibrant.getHex(),
            similars,
          },
          () =>
          {},
        ));
    }
    if (similars) this.setState({ similars });
    if (data && data.tags && data.tags.length > 1)
    {
      const similars2 = data.type.includes('MANGA')
        ? await Anilist.get(bigFuckingQueryM, similarReq2)
        : await Anilist.get(bigFuckingQueryS, similarReq2);

      if (similars2) this.setState({ similars2 });
    }
    if (this.state.data)
    {
      this.setState(
        {
          loading: false,
        },
        async () =>
        {
          if (data.type.includes('MANGA'))
          {
            this.setState({ eps: null, epError: false });
          }
          else if (
            data.format.includes('OVA') ||
            data.format.includes('ONA') ||
            data.format.includes('SPIN_OFF')
          )
          {
            this.setState({ eps: null, epError: true });
          }
          else
          {
            return null;
          }
          return false;
        },
      );
    }
  };

  executeTwist = async (reload) =>
  {
    const db = this.props.firebase.ref('anime').child('twist');
    const dbval = await db.once('value');
    if (dbval && Object(dbval.val())[this.state.id])
    {
      const eps = await db.child(this.state.id).once('value');
      if (eps)
      {
        return Kitsu.addKitsuMetadata(
          this.state.data.Media.title.romaji,
          eps.val(),
          this.state.data.Media.format,
        )
          .then(km =>
            this.setState({ eps: km }, () =>
              console.info('[mirai] Loaded from database')))
          .catch(kmN => this.setState({ eps: kmN }));
      } throw new Error('owo');
    }
    else if (this.props.mir && this.props.mir.twist)
    {
      if (
        this.props.mir.play &&
        this.props.mir.play.eps &&
        this.props.mir.play.meta &&
        this.props.mir.play.meta.id === this.state.id &&
        !reload
      )
      {
        return this.setState({ eps: this.props.mir.play.eps });
      }
      const correctedtitle = bigfuck(this.state.data.Media.title.romaji.toLowerCase());
      const meta = Object.values(this.props.mir.twist).filter(s =>
        s.name.toLowerCase().match(`${correctedtitle}`));
      // console.log(meta);
      if (meta.length > 0)
      {
        const eps = await Twist.get(meta[0].link, meta[0].ongoing);
        try
        {
          if (eps)
          {
            return Kitsu.addKitsuMetadata(
              this.state.data.Media.title.romaji,
              eps,
              this.state.data.Media.format,
            )
              .then(finishedEps =>
                this.setState({ eps: finishedEps }, async () =>
                {
                  if (meta[0].ongoing === false)
                  {
                    const dbtwist = this.props.firebase
                      .ref('anime')
                      .child('twist');
                    return dbtwist.child(this.state.id).update(finishedEps);
                    // console.info('[mirai] Uploaded to database');
                  }
                  return null;
                }))
              .catch(kmN =>
                this.setState({ eps: kmN }, async () =>
                {
                  if (meta[0].ongoing === false)
                  {
                    const dbtwist = this.props.firebase
                      .ref('anime')
                      .child('twist');
                    return dbtwist.child(this.state.id).update(kmN);
                  }
                  return null;
                }));
          }
        }
        catch (error)
        {
          return this.setState({ epError: true });
        }
      }
      else
      {
        return this.setState({ epError: true });
      }
    }
    else
    {
      return this.setState({ epError: true });
    }
    return false;
  };

  tabChange = (e, val) => this.setState({ tabVal: val });

  play = () =>
  {
    window.scrollTo(0, 0);
    if (
      this.state.data.Media &&
      this.state.data.Media.type.includes('ANIME') &&
      this.state.eps
    )
    {
      this.props
        .sendDataToMir({
          eps: Object.values(this.state.eps),
          meta: this.state.data.Media,
          id: this.state.data.Media.id,
        })
        .then(() =>
        {
          // console.log(this.props);
          this.setState({ statusVal: 'w' }, () =>
          {
            this.addToWatching().then(() => this.props.history.push('/watch'));
          });
        });
    }
    else
    {
      this.props.history.push(
        `/read?r=${this.state.data.Media.id}`,
        this.state.data.Media,
      );
    }
  };

  stream = () =>
  {
    window.scrollTo(0, 0);
    if (
      this.state.data.Media &&
      this.state.data.Media.type.includes('ANIME') &&
      this.state.eps
    )
    {
      const streamopts = {
        title: this.state.data.Media.title.romaji,
        cover: this.state.data.Media.coverImage.large,
        eps: this.state.eps,
      };
      return this.props.history.push('/stream', streamopts);
    }
    return null;
  };

  openEntity = (link) =>
  {
    this.props.history.push(link);
  };

  atLeave = () =>
  {
    if (this.state.data.Media && this.state.data.Media.trailer)
    {
      const tbg = document.getElementById('trailerbg');
      tbg.remove();
    }
  };

  like = async () =>
  {
    const data = this.state.data.Media;
    const name = data.title.romaji;
    const image = data.coverImage.large;
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    if (!isEmpty(this.props.profile))
    {
      this.props.firebase
        .update(
          `users/${this.props.profile.userID}/favs/${entity}/${data.id}`,
          {
            name,
            image,
            id: data.id,
            link:
              this.props.history.location.pathname +
              this.props.history.location.search,
            bg: data.bannerImage
              ? data.bannerImage
              : this.state.hue ? this.state.hue : null,
            avgScore: data.averageScore,
            meanScore: data.meanScore,
            rank:
              data.rankings && data.rankings.length > 0
                ? data.rankings[0]
                : null,
          },
        )
        .then(() =>
        {
          this.setState({ fav: true }, () =>
          {
            if (
              data &&
              !isEmpty(this.props.profile) &&
              this.props.profile.username &&
              this.props.profile.willLog
            )
            {
              this.props.firebase
                .ref('/users')
                .child(this.props.profile.userID)
                .child('feed')
                .child(`${this.state.id}F`)
                .update({
                  date: Date.now(),
                  id: `${this.state.id}F`,
                  showId: this.state.id,
                  type: 'FAV',
                  activity: `Favorited ${data.title.romaji}`,
                  bgImg:
                    this.state.data.Media.bannerImage &&
                    this.state.data.Media.bannerImage,
                  coverImg: this.state.data.Media.coverImage.large,
                  user: {
                    username: this.props.profile.username,
                    avatar: this.props.profile.avatar,
                    userID: this.props.profile.userID,
                  },
                });
            }
          });
        });
    }
  };

  unlike = async () =>
  {
    const data = this.state.data.Media;
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    if (!isEmpty(this.props.profile))
    {
      this.props.firebase
        .remove(`users/${this.props.profile.userID}/favs/${entity}/${data.id}`)
        .then(() =>
          this.setState({ fav: false }, () =>
          {
            if (
              data &&
              !isEmpty(this.props.profile) &&
              this.props.profile.username &&
              this.props.profile.willLog
            )
            {
              this.props.firebase
                .ref('/users')
                .child(this.props.profile.userID)
                .child('feed')
                .child(`${this.state.id}F`)
                .remove();
            }
          }));
    }
  };

  RecommendThis = async () =>
  {
    const data = this.state.data.Media;
    const name = data.title.romaji;
    const image = data.coverImage.large;
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    if (!isEmpty(this.props.profile))
    {
      this.props.firebase
        .update(
          `users/${this.props.profile.userID}/recommends/${entity}/${data.id}`,
          {
            name,
            image,
            id: data.id,
            link:
              this.props.history.location.pathname +
              this.props.history.location.search,
            bg: data.bannerImage
              ? data.bannerImage
              : this.state.hue ? this.state.hue : null,
            avgScore: data.averageScore,
            meanScore: data.meanScore,
            date: Date.now(),
            rank:
              data.rankings && data.rankings.length > 0
                ? data.rankings[0]
                : null,
          },
        )
        .then(() =>
        {
          this.setState({ recommend: true }, () =>
          {
            if (
              data &&
              !isEmpty(this.props.profile) &&
              this.props.profile.username &&
              this.props.profile.willLog
            )
            {
              this.props.firebase
                .ref('/users')
                .child(this.props.profile.userID)
                .child('feed')
                .child(`${this.state.id}R`)
                .update({
                  date: Date.now(),
                  id: `${this.state.id}R`,
                  showId: this.state.id,
                  type: 'RECOMMEND',
                  activity: `Recommended ${data.title.romaji}`,
                  bgImg:
                    this.state.data.Media.bannerImage &&
                    this.state.data.Media.bannerImage,
                  coverImg: this.state.data.Media.coverImage.large,
                  user: {
                    username: this.props.profile.username,
                    avatar: this.props.profile.avatar,
                    userID: this.props.profile.userID,
                  },
                });
            }
          });
        });
    }
  };

  DontRecommendThis = async () =>
  {
    const data = this.state.data.Media;
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    if (!isEmpty(this.props.profile))
    {
      this.props.firebase
        .remove(`users/${this.props.profile.userID}/recommends/${entity}/${data.id}`)
        .then(() =>
          this.setState({ recommend: false }, () =>
          {
            if (
              data &&
              !isEmpty(this.props.profile) &&
              this.props.profile.username &&
              this.props.profile.willLog
            )
            {
              this.props.firebase
                .ref('/users')
                .child(this.props.profile.userID)
                .child('feed')
                .child(`${this.state.id}R`)
                .remove();
            }
          }));
    }
  };

  addToLater = async () =>
  {
    const data = this.state.data.Media;
    const name = data.title.romaji;
    const image = data.coverImage.large;
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    if (!isEmpty(this.props.profile))
    {
      this.props.firebase
        .update(
          `users/${this.props.profile.userID}/later/${entity}/${data.id}`,
          {
            name,
            image,
            id: data.id,
            link:
              this.props.history.location.pathname +
              this.props.history.location.search,
            date: Date.now(),
            bg: data.bannerImage
              ? data.bannerImage
              : this.state.hue ? this.state.hue : null,
            avgScore: data.averageScore,
            meanScore: data.meanScore,
            type: data.status.includes('NOT_YET_RELEASED') ? 'TBA' : null,
            rank:
              data.rankings && data.rankings.length > 0
                ? data.rankings[0]
                : null,
          },
        )
        .then(() =>
        {
          if (
            data &&
            !isEmpty(this.props.profile) &&
            this.props.profile.username &&
            this.props.profile.willLog
          )
          {
            this.props.firebase
              .ref('/users')
              .child(this.props.profile.userID)
              .child('feed')
              .child(`${this.state.id}L`)
              .update({
                date: Date.now(),
                id: `${this.state.id}L`,
                showId: this.state.id,
                type: 'LATER',
                activity: `Added ${data.title.romaji} to their later list`,
                bgImg:
                  this.state.data.Media.bannerImage &&
                  this.state.data.Media.bannerImage,
                coverImg: this.state.data.Media.coverImage.large,
                user: {
                  username: this.props.profile.username,
                  avatar: this.props.profile.avatar,
                  userID: this.props.profile.userID,
                },
              });
          }
        });
    }
  };

  removeFromLater = async () =>
  {
    const data = this.state.data.Media;
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    if (!isEmpty(this.props.profile))
    {
      this.props.firebase
        .remove(`users/${this.props.profile.userID}/later/${entity}/${data.id}`)
        .then(() =>
        {
          if (
            data &&
            !isEmpty(this.props.profile) &&
            this.props.profile.username &&
            this.props.profile.willLog
          )
          {
            this.props.firebase
              .ref('/users')
              .child(this.props.profile.userID)
              .child('feed')
              .child(`${this.state.id}L`)
              .remove();
          }
        });
    }
  };

  reportError = () => this.setState({ reportModal: !this.state.reportModal });

  handleStatus = event =>
    this.setState({ [event.target.name]: event.target.value });

  changerVal = e => this.setState({ rVal: e.target.value });

  rSendMReport = async () =>
  {
    if (isEmpty(this.props.profile))
    {
      if (this.state.userlessREmail !== '')
      {
        return this.props.firebase
          .database()
          .ref('/reports')
          .child('m')
          .child(this.state.id)
          .update({
            reporter: this.state.userlessREmail,
            info: 'Missing content',
          });
      }
      return null;
    }
    return this.props.firebase
      .database()
      .ref('/reports')
      .child('m')
      .child(this.state.id)
      .update({
        reporter: this.props.profile.userID,
        info: 'Missing content',
      });
  };

  rSendWReport = async () =>
  {
    if (isEmpty(this.props.profile))
    {
      if (this.state.userlessREmail !== '')
      {
        return this.props.firebase
          .database()
          .ref('/reports')
          .child('w')
          .child(this.state.id)
          .update({
            reporter: this.state.userlessREmail,
            info: 'Wrong info',
          });
      }
      return null;
    }
    return this.props.firebase
      .database()
      .ref('/reports')
      .child('w')
      .child(this.state.id)
      .update({
        reporter: this.props.profile.userID,
        info: 'Wrong info',
      });
  };

  rSendDReport = async () =>
  {
    if (isEmpty(this.props.profile))
    {
      if (this.state.userlessREmail !== '')
      {
        return this.props.firebase
          .database()
          .ref('/reports')
          .child('d')
          .child(this.state.id)
          .update({
            reporter: this.state.userlessREmail,
            info: 'Copyright issues',
          });
      }
      return null;
    }
    return this.props.firebase
      .database()
      .ref('/reports')
      .child('d')
      .child(this.state.id)
      .update({
        reporter: this.props.profile.userID,
        info: 'Copyright issues',
      });
  };

  showEpisodes = () => this.setState({ showEpisodes: !this.state.showEpisodes });

  addToCompleted = async () =>
  {
    const data = this.state.data.Media;
    const name = data.title.romaji;
    const image = data.coverImage.large;
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    if (
      this.props.profile.dropped &&
      this.props.profile.dropped[entity] &&
      this.props.profile.dropped[entity][data.id]
    )
    {
      this.props.firebase
        .database()
        .ref('users')
        .child(this.props.profile.userID)
        .child('dropped')
        .child(entity)
        .child(data.id)
        .remove();
    }
    if (!isEmpty(this.props.profile))
    {
      this.props.firebase
        .update(
          `users/${this.props.profile.userID}/completed/${entity}/${data.id}`,
          {
            name,
            image,
            id: data.id,
            link:
              this.props.history.location.pathname +
              this.props.history.location.search,
            date: Date.now(),
            bg: data.bannerImage
              ? data.bannerImage
              : this.state.hue ? this.state.hue : null,
            avgScore: data.averageScore,
            meanScore: data.meanScore,
            type: data.status.includes('NOT_YET_RELEASED') ? 'TBA' : null,
            rank:
              data.rankings && data.rankings.length > 0
                ? data.rankings[0]
                : null,
          },
        )
        .then(() =>
        {
          if (
            data &&
            !isEmpty(this.props.profile) &&
            this.props.profile.username &&
            this.props.profile.willLog
          )
          {
            this.props.firebase
              .ref('/users')
              .child(this.props.profile.userID)
              .child('feed')
              .child(`${this.state.id}C`)
              .update({
                date: Date.now(),
                id: `${this.state.id}C`,
                showId: this.state.id,
                type: 'COMPLETED',
                format: entity,
                activity: `Completed ${data.title.romaji}`,
                bgImg:
                  this.state.data.Media.bannerImage &&
                  this.state.data.Media.bannerImage,
                coverImg: this.state.data.Media.coverImage.large,
                user: {
                  username: this.props.profile.username,
                  avatar: this.props.profile.avatar,
                  userID: this.props.profile.userID,
                },
              });
          }
        });
    }
  };

  addToDropped = async () =>
  {
    const data = this.state.data.Media;
    const name = data.title.romaji;
    const image = data.coverImage.large;
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    // You can't drop something you've completed so...................
    if (
      this.props.profile.completed &&
      this.props.profile.completed[entity] &&
      this.props.profile.completed[entity][data.id]
    )
    {
      return null;
    }
    if (!isEmpty(this.props.profile))
    {
      this.props.firebase
        .update(
          `users/${this.props.profile.userID}/dropped/${entity}/${data.id}`,
          {
            name,
            image,
            id: data.id,
            link:
              this.props.history.location.pathname +
              this.props.history.location.search,
            date: Date.now(),
            bg: data.bannerImage
              ? data.bannerImage
              : this.state.hue ? this.state.hue : null,
            avgScore: data.averageScore,
            meanScore: data.meanScore,
            type: data.status.includes('NOT_YET_RELEASED') ? 'TBA' : null,
            rank:
              data.rankings && data.rankings.length > 0
                ? data.rankings[0]
                : null,
          },
        )
        .then(() =>
        {
          if (
            data &&
            !isEmpty(this.props.profile) &&
            this.props.profile.username &&
            this.props.profile.willLog
          )
          {
            this.props.firebase
              .ref('/users')
              .child(this.props.profile.userID)
              .child('feed')
              .child(`${this.state.id}D`)
              .update({
                date: Date.now(),
                id: `${this.state.id}D`,
                showId: this.state.id,
                type: 'DROPPED',
                format: entity,
                activity: `Dropped ${data.title.romaji}`,
                bgImg:
                  this.state.data.Media.bannerImage &&
                  this.state.data.Media.bannerImage,
                coverImg: this.state.data.Media.coverImage.large,
                user: {
                  username: this.props.profile.username,
                  avatar: this.props.profile.avatar,
                  userID: this.props.profile.userID,
                },
              });
          }
        });
      return null;
    }
    return null;
  };

  addToWatching = async () =>
  {
    const data = this.state.data.Media;
    const entity = data.type.includes('ANIME') ? 'show' : 'manga';
    if (
      this.props.profile.dropped &&
      this.props.profile.dropped[entity][data.id]
    )
    {
      this.props.firebase
        .database()
        .ref('users')
        .child(this.props.profile.userID)
        .child('dropped')
        .child(entity)
        .child(data.id)
        .remove()
        .then(() =>
        {
          if (
            data &&
            !isEmpty(this.props.profile) &&
            this.props.profile.username &&
            this.props.profile.willLog
          )
          {
            this.props.firebase
              .ref('/users')
              .child(this.props.profile.userID)
              .child('feed')
              .child(`${this.state.id}UD`)
              .update({
                date: Date.now(),
                id: `${this.state.id}UD`,
                showId: this.state.id,
                type: 'UNDROPPED',
                format: entity,
                activity: `Undropped ${data.title.romaji}`,
                bgImg:
                  this.state.data.Media.bannerImage &&
                  this.state.data.Media.bannerImage,
                coverImg: this.state.data.Media.coverImage.large,
                user: {
                  username: this.props.profile.username,
                  avatar: this.props.profile.avatar,
                  userID: this.props.profile.userID,
                },
              });
          }
        });
    }
  };

  changeStatusVal = e =>
    this.setState({ statusVal: e.target.value }, async () =>
    {
      switch (this.state.statusVal)
      {
        case '':
          break;
        case 'c':
          await this.addToCompleted();
          break;
        case 'w':
          await this.addToWatching();
          break;
        case 'd':
          await this.addToDropped();
          break;
        default:
          break;
      }
    });

  render()
  {
    const { classes, mir, theme } = this.props;
    const {
      data,
      loading,
      hue,
      hueVib,
      similars,
      fav,
      eps,
      epError,
      menuEl,
      similars2,
      lang,
      rVal,
      userlessREmail,
      showEpisodes,
      error,
      statusVal,
    } = this.state;
    const openMenu = Boolean(menuEl);

    const user = this.props.profile;

    const menu = (
      <Menu
        id="more-menu"
        anchorEl={menuEl}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        MenuListProps={{ style: { padding: 0 } }}
        PaperProps={{ style: { background: hue } }}
        open={openMenu}
        onClose={() => this.setState({ menuEl: null })}
      >
        <MenuItem
          onClick={() =>
{
            this.setState({ menuEl: null });
            this.reportError();
          }}
        >
          {lang.show.moreMenu.report}
        </MenuItem>
        {user.isDeveloper === true ? (
          <MenuItem onClick={this.editEntry}>
            {lang.show.moreMenu.editentry}
          </MenuItem>
        ) : null}
      </Menu>
    );

    if (error)
    {
      return (
        <div className={classes.frame}>
          <TitleHeader
            title="Well this is kinda awkward..."
            subtitle={error}
            color={hue}
            colortext={hueVib}
          />
        </div>
      );
    }

    return (
      <div className={classes.frame}>
        <LoadingIndicator loading={loading} />
        <div>
          <TitleHeader color={hue !== '#111' ? hue : null} colortext={hueVib} />
        </div>
        <Root id="previewFrame" className={classes.root}>
          {!loading && data && data.Media ? (
            <div>
              <Header
                image={data.Media.bannerImage ? data.Media.bannerImage : null}
              />
              <Container
                spacing={16}
                id="mainHeader"
                style={{ background: hue }}
              >
                <Grid
                  item
                  xs={3}
                  style={{ maxWidth: 300, margin: 'auto' }}
                  className={classes.leftSide}
                >
                  <div
                    aria-controls="button"
                    className={
                      mir && mir.play && mir.play.meta.id === data.Media.id
                        ? classes.artworkDisabled
                        : data.Media.type.includes('MANGA')
                          ? classes.artwork
                          : data.Media.status.includes('NOT_YET_RELEASED') ||
                            !eps
                            ? classes.artworkDisabled
                            : classes.artwork
                    }
                    onClick={
                      mir && mir.play && mir.play.meta.id === data.Media.id
                        ? null
                        : data.Media.type.includes('MANGA')
                          ? null
                          : data.Media.status.includes('NOT_YET_RELEASED') ||
                            !eps
                            ? null
                            : this.play
                    }
                    style={{
                      pointerEvents: data.Media.type.includes('MANGA')
                        ? 'none'
                        : null,
                    }}
                    onMouseOver={e =>
                      (data.Media.type.includes('MANGA')
                        ? null
                        : (e.currentTarget.style.background = hue))
                    }
                  >
                    <img
                      src={data.Media.coverImage.large}
                      alt=""
                      className={classes.artworkimg}
                      style={{ opacity: 0 }}
                      onLoad={e => (e.currentTarget.style.opacity = null)}
                    />
                    <CircularProgress
                      className={classes.loadingArtwork}
                      style={
                        data.Media.type.includes('MANGA')
                          ? { opacity: 0 }
                          : eps
                            ? { opacity: 0 }
                            : epError ? { opacity: 0 } : null
                      }
                    />
                    <Typography className="artworktitle" variant="display1">
                      {mir && mir.play && mir.play.meta.id === data.Media.id ? (
                        lang.show.playing
                      ) : data.Media.status.includes('NOT_YET_RELEASED') ? (
                        'TBA'
                      ) : data.Media.type.includes('MANGA') ? null : eps ? (
                        <Button
                          variant="fab"
                          style={{ background: hue }}
                          className={classes.playArtworkButtonContainer}
                        >
                          <Icon.PlayArrow
                            className={classes.playArtworkButton}
                          />
                        </Button>
                      ) : epError ? (
                        lang.show.notavaliable
                      ) : null}
                    </Typography>
                  </div>
                  {!isEmpty(user) &&
                  data.Media.type.includes('ANIME') &&
                  !data.Media.status.includes('NOT_YET_RELEASED') &&
                  eps &&
                  !epError ? (
                    <Button
                      variant="raised"
                      color="primary"
                      className={classes.streamButton}
                      style={{ background: hue, color: 'white' }}
                      onClick={this.stream}
                    >
                      {lang.show.livestreamButton}
                    </Button>
                  ) : null}
                </Grid>
                <Grid item xs className={classes.mainFrame}>
                  <div className={classes.smallTitlebar}>
                    {data.Media.type.includes('ANIME') ? (
                      <Typography
                        className={classes.smallTitle}
                        variant="display2"
                      >
                        {data.Media.title.native}{' '}
                        {`• ${data.Media.startDate.year}`}{' '}
                        {`• ${Math.floor(data.Media.duration / 60)} h ${data
                          .Media.duration % 60} min`}
                      </Typography>
                    ) : (
                      <Typography
                        className={classes.smallTitle}
                        variant="display2"
                      >
                        {data.Media.title.native}{' '}
                        {!data.Media.status.includes('RELEASING')
                          ? `• ${data.Media.startDate.year}` +
                            `• ${data.Media.chapters} ${
                              lang.show.chapters
                            } in ${data.Media.volumes} ${lang.show.volumes}`
                          : null}
                      </Typography>
                    )}
                    <div style={{ flex: 1 }} />
                    <Typography
                      className={classes.smallTitle}
                      style={{ cursor: 'pointer' }}
                      onClick={() => window.open(data.Media.siteUrl)}
                      variant="display2"
                    >
                      {lang.show.provider}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <Typography
                      style={{ margin: 'auto' }}
                      className={classes.bigTitle}
                      variant="display3"
                    >
                      {data.Media.title.romaji}
                    </Typography>
                    <div style={{ flex: 1 }} />
                    <Tooltip
                      style={{ margin: 'auto' }}
                      title={lang.show.episodeTooltip}
                    >
                      <Typography
                        className={classes.artworktype}
                        variant="display1"
                      >
                        {data.Media.status
                          .replace('RELEASING', 'ONGOING')
                          .replace(/_/gi, ' ')}{' '}
                        {data.Media.type} <br />
                        {data.Media.nextAiringEpisode
                          ? `${timeFormatter(data.Media.nextAiringEpisode.timeUntilAiring)} ${lang.show.episodeWhen} ${
                              data.Media.nextAiringEpisode.episode
                            } ${lang.show.arrives}`
                          : null}
                      </Typography>
                    </Tooltip>
                  </div>
                  {data.Media.synonyms && data.Media.synonyms.length > 0 ? (
                    <div style={{ display: 'flex', width: '100%' }}>
                      <Typography
                        style={{ marginTop: -2 }}
                        className={classes.smallTitle}
                        variant="display1"
                      >
                        {`${lang.show.alsoKnownAs} `}
                        {data.Media.synonyms.map(s => s).join(', ')}
                      </Typography>
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ margin: 'auto' }}>
                      <div style={{ display: 'flex' }}>
                        {data.Media.staff &&
                        data.Media.staff.edges.filter(s => s.role === 'Director')[0] ? (
                          <Typography className={classes.boldD} variant="body1">
                            {lang.show.director}
                          </Typography>
                        ) : null}
                        {data.Media.staff &&
                        data.Media.staff.edges.filter(s => s.role === 'Director')[0] ? (
                          <Typography
                            className={classes.smallD}
                            variant="body1"
                          >
                            {
                              data.Media.staff.edges.filter(s => s.role === 'Director')[0].node.name.first
                            }{' '}
                            {data.Media.staff.edges.filter(s => s.role === 'Director')[0].node.name.last
                              ? data.Media.staff.edges.filter(s => s.role === 'Director')[0].node.name.last
                              : null}
                          </Typography>
                        ) : null}
                        {data.Media.staff &&
                        data.Media.staff.edges.filter(s => s.role === 'Original Creator')[0] ? (
                          <div className={classes.sepD}>
                            <Typography
                              className={classes.boldD}
                              variant="body1"
                            >
                              {data.Media.staff.edges.filter(s => s.role === 'Director')[0]
                                ? lang.show.author
                                : lang.show.authorProper}
                            </Typography>
                            <Typography
                              className={classes.smallD}
                              variant="body1"
                            >
                              {
                                data.Media.staff.edges.filter(s => s.role === 'Original Creator')[0].node.name.first
                              }{' '}
                              {data.Media.staff.edges.filter(s => s.role === 'Original Creator')[0].node.name.last
                                ? data.Media.staff.edges.filter(s => s.role === 'Original Creator')[0].node.name.last
                                : null}
                            </Typography>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div className={classes.genreRow}>
                      {data.Media.genres
                        ? data.Media.genres.map((o, index) => (
                          <Chip
                            className={classes.tagChip}
                            key={index}
                            label={o}
                          />
                          ))
                        : null}
                    </div>
                  </div>
                  <Divider />
                  <Typography
                    className={classes.boldD}
                    variant="body1"
                    style={{ marginTop: theme.spacing.unit }}
                  >
                    Synopsis
                  </Typography>
                  <Typography
                    className={classes.desc}
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: data.Media.description }}
                  />
                  {data.Media.rankings ? (
                    <Grid container style={{ marginTop: theme.spacing.unit }}>
                      {data.Media.rankings.map((ran, index) => (
                        <Paper
                          key={index}
                          className={classes.commandoTextBoxRow}
                          style={{ flex: 1, maxWidth: 200 }}
                        >
                          <Typography
                            variant="title"
                            className={classes.commandoTextNumberRow}
                            style={{ color: hueVib }}
                          >
                            #{ran.rank}
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.commandoTextLabelRow}
                          >
                            {ran.context} {ran.format.replace(/_/gi, ' ')}{' '}
                            {ran.season} {ran.year}
                          </Typography>
                        </Paper>
                      ))}
                    </Grid>
                  ) : null}
                </Grid>
              </Container>
              <MainCard>
                {showEpisodes ? (
                  <FadeIn>
                    <Container
                      style={{
                        maxHeight: showEpisodes ? 500 : 0,
                        opacity: showEpisodes ? 1 : 0,
                        padding: showEpisodes ? 24 : 0,
                      }}
                    >
                      <Column>
                        <Divider style={{ marginBottom: 8 }} />
                        <SectionTitle
                          style={{ opacity: showEpisodes ? 1 : 0 }}
                          title={lang.show.episodes}
                        />
                        <ItemContainer
                          style={{ opacity: showEpisodes ? 1 : 0 }}
                        >
                          {eps &&
                            eps.map((ep, index) => (
                              <Grid item>
                                <Chip
                                  onClick={() => this.play(ep.ep)}
                                  style={{ background: hue }}
                                  className={classnames(
                                    classes.epCard,
                                    ep.ep === !isEmpty(user) &&
                                    user.episodeProgress &&
                                    user.episodeProgress[data.Media.id] &&
                                    user.episodeProgress[data.Media.id].ep
                                      ? classes.epCardActive
                                      : null,
                                  )}
                                  key={index}
                                  label={ep.ep}
                                />
                              </Grid>
                            ))}
                        </ItemContainer>
                      </Column>
                    </Container>
                  </FadeIn>
                ) : null}
                <CommandoBar
                  style={{
                    borderTop: '1px solid rgba(255,255,255,.1',
                    borderBottom: 'none',
                  }}
                >
                  {data.Media.averageScore ? (
                    <div className={classes.commandoTextBox}>
                      <Typography
                        variant="title"
                        className={classes.commandoText}
                        style={{ color: hueVib }}
                      >
                        {data.Media.averageScore}%
                      </Typography>
                      <Typography
                        variant="body1"
                        className={classes.commandoTextLabel}
                      >
                        {lang.show.avgscore}
                      </Typography>
                    </div>
                  ) : null}
                  {data.Media.meanScore ? (
                    <div className={classes.commandoTextBox}>
                      <Typography
                        variant="title"
                        className={classes.commandoText}
                      >
                        {data.Media.meanScore}%
                      </Typography>
                      <Typography
                        variant="body1"
                        className={classes.commandoTextLabel}
                      >
                        {lang.show.meanscore}
                      </Typography>
                    </div>
                  ) : null}
                  {data.Media.type.includes('MANGA') ||
                  !data.Media.season ? null : (
                    <Button
                      style={{
                        textTransform: 'initial',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onClick={() =>
                        window.open(`http://anichart.net/${`${data.Media.season.toLowerCase()}-${
                            data.Media.startDate.year
                          }`}`)
                      }
                      className={classes.commandoTextBox}
                    >
                      <Typography
                        variant="title"
                        className={classes.commandoText}
                      >
                        {data.Media.season &&
                          `${data.Media.season} ${data.Media.startDate.year}`}
                      </Typography>
                    </Button>
                  )}
                  {data.Media.type.includes('MANGA') ||
                  data.Media.format.includes('ONA') ||
                  data.Media.format.includes('OVA') ? null : !eps &&
                  !epError ? (
                    <CircularProgress
                      style={{ color: hueVib }}
                      className={classes.commandoTextBox}
                    />
                  ) : epError ? (
                    <FadeIn>
                      <div className={classes.commandoTextBox}>
                        <div
                          style={{ color: 'white', lineHeight: 0 }}
                          className={classes.commandoText}
                        >
                          <Icon.ErrorOutline />
                        </div>
                        <Typography
                          variant="body1"
                          className={classes.commandoTextLabel}
                        >
                          {lang.show.episodes}
                        </Typography>
                      </div>
                    </FadeIn>
                  ) : (
                    <FadeIn>
                      <div className={classes.commandoTextBox}>
                        <Typography
                          variant="title"
                          className={classes.commandoText}
                        >
                          {eps ? eps.length : '...'}
                        </Typography>
                        <Typography
                          variant="body1"
                          className={classes.commandoTextLabel}
                        >
                          {lang.show.episodes}
                        </Typography>
                      </div>
                    </FadeIn>
                  )}
                  <div style={{ flex: 1 }} />
                  {!isEmpty(user) &&
                  user.episodeProgress &&
                  user.episodeProgress[data.Media.id] ? (
                    <div className={classes.progressCon}>
                      <Typography
                        variant="title"
                        className={classes.progressTitle}
                      >
                        Episode {user.episodeProgress[data.Media.id].ep}{' '}
                        {eps &&
                        eps[user.episodeProgress[data.Media.id].ep - 1].canon
                          ? ` • ${
                            eps[user.episodeProgress[data.Media.id].ep - 1]
                              .canon}`
                          : null}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={user.episodeProgress[data.Media.id].played * 100}
                        classes={{
                          colorPrimary: classes.progressBar,
                          barColorPrimary: classes.progressBarActive,
                        }}
                      />
                      <Typography
                        variant="body1"
                        className={classes.commandoTextLabel}
                      >
                        {statusVal.includes('c')
                          ? lang.show.rewatchprogress
                          : lang.show.progress}
                      </Typography>
                    </div>
                  ) : null}
                  <div style={{ flex: 1 }} />
                  {data.Media.hashtag ? (
                    <Button
                      color="default"
                      onClick={() =>
                        window.open(`https://twitter.com/hashtag/${data.Media.hashtag.replace(
                            '#',
                            '',
                          )}`)
                      }
                    >
                      <svg
                        style={{ width: 28, height: 28, marginRight: 8 }}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#FFFFFF"
                          d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"
                        />
                      </svg>{' '}
                      {data.Media.hashtag}
                    </Button>
                  ) : null}
                  {!isEmpty(user) ? (
                    <Tooltip
                      title={
                        data.Media.type.includes('ANIME')
                          ? user.recommends &&
                            user.recommends.show &&
                            user.recommends.show[this.state.id]
                            ? lang.show.nonrecommend
                            : lang.show.recommend
                          : user.recommends &&
                            user.recommends.manga &&
                            user.recommends.manga[this.state.id]
                            ? lang.show.nonrecommend
                            : lang.show.recommend
                      }
                    >
                      <IconButton
                        className={classes.commandoButton}
                        color="default"
                        onClick={
                          data.Media.type.includes('ANIME')
                            ? user.recommends &&
                              user.recommends.show &&
                              user.recommends.show[this.state.id]
                              ? this.DontRecommendThis
                              : this.RecommendThis
                            : user.recommends &&
                              user.recommends.manga &&
                              user.recommends.manga[this.state.id]
                              ? this.DontRecommendThis
                              : this.RecommendThis
                        }
                      >
                        {data.Media.type.includes('ANIME') ? (
                          user.recommends &&
                          user.recommends.show &&
                          user.recommends.show[this.state.id] ? (
                            <Icon.SentimentVerySatisfied />
                          ) : (
                            <Icon.SentimentNeutral />
                          )
                        ) : user.recommends &&
                        user.recommends.manga &&
                        user.recommends.manga[this.state.id] ? (
                          <Icon.SentimentVerySatisfied />
                        ) : (
                          <Icon.SentimentNeutral />
                        )}
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {!isEmpty(user) ? (
                    <Tooltip
                      title={
                        data.Media.type.includes('ANIME')
                          ? user.later &&
                            user.later.show &&
                            user.later.show[this.state.id]
                            ? lang.show.removelater
                            : lang.show.addlater
                          : user.later &&
                            user.later.manga &&
                            user.later.manga[this.state.id]
                            ? lang.show.removelater
                            : lang.show.addlater
                      }
                    >
                      <IconButton
                        className={classes.commandoButton}
                        color="default"
                        onClick={
                          data.Media.type.includes('ANIME')
                            ? user.later &&
                              user.later.show &&
                              user.later.show[this.state.id]
                              ? this.removeFromLater
                              : this.addToLater
                            : user.later &&
                              user.later.manga &&
                              user.later.manga[this.state.id]
                              ? this.removeFromLater
                              : this.addToLater
                        }
                      >
                        {data.Media.type.includes('ANIME') ? (
                          user.later &&
                          user.later.show &&
                          user.later.show[this.state.id] ? (
                            <Icon.AddCircle />
                          ) : (
                            <Icon.AddCircleOutline />
                          )
                        ) : user.later &&
                        user.later.manga &&
                        user.later.manga[this.state.id] ? (
                          <Icon.AddCircle />
                        ) : (
                          <Icon.AddCircleOutline />
                        )}
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {!isEmpty(user) ? (
                    <Tooltip
                      title={fav ? lang.show.removefav : lang.show.addfav}
                    >
                      <IconButton
                        className={classes.commandoButton}
                        color="default"
                        onClick={
                          data.Media.type.includes('ANIME')
                            ? user.favs &&
                              user.favs.show &&
                              user.favs.show[this.state.id]
                              ? this.unlike
                              : this.like
                            : user.favs &&
                              user.favs.manga &&
                              user.favs.manga[this.state.id]
                              ? this.unlike
                              : this.like
                        }
                      >
                        {fav ? <Icon.Favorite /> : <Icon.FavoriteBorder />}
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {isEmpty(user) ? null : (
                    <IconButton
                      aria-owns={openMenu ? 'more-menu' : null}
                      aria-haspopup="true"
                      onClick={e => this.setState({ menuEl: e.currentTarget })}
                      color="default"
                    >
                      <Icon.MoreVert />
                    </IconButton>
                  )}
                  {menu}
                  <Dialogue
                    aria-labelledby="report-modal"
                    aria-describedby="reports"
                    open={this.state.reportModal}
                    onClose={() => this.setState({ reportModal: false })}
                    title={`${lang.show.reportModal.title} ${data.Media.title.romaji} ${lang.show.reportModal.errors}`}
                  >
                    <form autoComplete="off">
                      <FormControl fullWidth>
                        <InputLabel htmlFor="rVal">
                          {lang.show.reportModal.select}
                        </InputLabel>
                        <Select
                          value={rVal}
                          onChange={this.changerVal}
                          inputProps={{
                            name: 'rval',
                            id: 'rVal',
                          }}
                        >
                          <MenuItem value="">
                            <em />
                          </MenuItem>
                          <MenuItem value="m">
                            Missing episodes/chapters
                          </MenuItem>
                          <MenuItem value="w">Wrong information</MenuItem>
                          <MenuItem value="d">Copyright Issues</MenuItem>
                        </Select>
                      </FormControl>
                    </form>
                    {rVal !== '' ? (
                      <Column>
                        {!isEmpty(user) ? (
                          rVal === 'm' ? (
                            <Button onClick={this.rSendMReport}>
                              Send using Mirai Account
                            </Button>
                          ) : rVal === 'w' ? (
                            <Button onClick={this.rSendWReport}>
                              Send using Mirai Account
                            </Button>
                          ) : rVal === 'd' ? (
                            <Button onClick={this.rSendDReport}>
                              Send using Mirai Account
                            </Button>
                          ) : null
                        ) : (
                          <form autoComplete="off">
                            <FormControl fullWidth>
                              <InputLabel htmlFor="emailR">
                                Your email address
                              </InputLabel>
                              <Input
                                id="emailR"
                                value={userlessREmail}
                                onChange={e =>
                                  this.setState({
                                    userlessREmail: e.target.value,
                                  })
                                }
                              />
                              {rVal === 'm' ? (
                                <Button onClick={this.rSendMReport}>
                                  Send
                                </Button>
                              ) : rVal === 'w' ? (
                                <Button onClick={this.rSendWReport}>
                                  Send
                                </Button>
                              ) : rVal === 'd' ? (
                                <Button onClick={this.rSendDReport}>
                                  Send
                                </Button>
                              ) : null}
                            </FormControl>
                          </form>
                        )}
                      </Column>
                    ) : null}
                  </Dialogue>
                </CommandoBar>
                <CommandoBar>
                  {!data.Media.status.includes('NOT_YET_RELEASED') ? (
                    <div className={classes.commandoTextBox}>
                      <Typography
                        variant="title"
                        className={classes.commandoText}
                      >
                        {`${data.Media.startDate.day}. ${moment(
                          data.Media.startDate.month,
                          'MM',
                        ).format('MMMM')} ${data.Media.startDate.year}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        className={classes.commandoTextLabel}
                      >
                        {data.Media.type.includes('ANIME') &&
                        data.Media.format.includes('TV')
                          ? lang.show.airingstart
                          : data.Media.format.includes('MOVIE')
                            ? lang.show.releasedate
                            : data.Media.format.includes('ONA')
                              ? lang.show.releasedate
                              : data.Media.format.includes('OVA')
                                ? lang.show.airingstart
                                : lang.show.publishstart}
                      </Typography>
                    </div>
                  ) : null}
                  {data.Media.format.includes('MOVIE') ? null : data.Media.format.includes('OVA') ? null : data.Media.format.includes('ONA') ? null : data.Media.status.includes('NOT_YET_RELEASED') ? null : !data.Media.status.includes('RELEASING') &&
                  data.Media.endDate ? (
                    <div className={classes.commandoTextBox}>
                      <Typography
                        variant="title"
                        className={classes.commandoText}
                      >
                        {`${data.Media.endDate.day}. ${moment(
                          data.Media.endDate.month,
                          'MM',
                        ).format('MMMM')} ${data.Media.endDate.year}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        className={classes.commandoTextLabel}
                      >
                        {data.Media.type.includes('ANIME')
                          ? lang.show.airingended
                          : lang.show.publishended}
                      </Typography>
                    </div>
                  ) : null}
                  <div className={classes.commandoTextBox}>
                    <Typography
                      variant="title"
                      className={classes.commandoText}
                    >
                      {data.Media.format}
                    </Typography>
                    <Typography
                      variant="body1"
                      className={classes.commandoTextLabel}
                    >
                      Type
                    </Typography>
                  </div>
                  <div style={{ flex: 1 }} />
                  {!isEmpty(user) ? (
                    <form autoComplete="off">
                      <FormControl fullWidth className={classes.statusForm}>
                        <InputLabel htmlFor="statusVal">
                          {lang.show.status.title}
                        </InputLabel>
                        <Select
                          value={statusVal}
                          onChange={this.changeStatusVal}
                          inputProps={{
                            name: 'statval',
                            id: 'statusVal',
                          }}
                        >
                          <MenuItem value="" />
                          <MenuItem
                            disabled={
                              statusVal.includes('c')
                                ? true
                                : !(user.episodeProgress &&
                                  user.episodeProgress[data.Media.id])
                            }
                            value="w"
                          >
                            {data.Media.type.includes('MANGA')
                              ? lang.show.status.reading
                              : lang.show.status.watching}
                          </MenuItem>
                          <MenuItem value="c">
                            {lang.show.status.finished}
                          </MenuItem>
                          <MenuItem
                            disabled={
                              !!(this.props.profile.completed &&
                              this.props.profile.completed[
                                data.Media.type.includes('ANIME')
                                  ? 'show'
                                  : 'manga'
                              ] &&
                              this.props.profile.completed[
                                data.Media.type.includes('ANIME')
                                  ? 'show'
                                  : 'manga'
                              ][data.Media.id])
                            }
                            value="d"
                          >
                            {lang.show.status.dropped}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </form>
                  ) : null}
                </CommandoBar>
                <Container>
                  <Grid item xs style={{ zIndex: 10 }}>
                    {data.Media.characters &&
                    data.Media.characters.edges.length > 0 ? (
                      <SectionTitle
                        title={
                          data.Media.type.includes('ANIME')
                            ? lang.show.cast
                            : lang.show.char
                        }
                      />
                    ) : null}
                    {data.Media.characters &&
                    data.Media.characters.edges.length > 0 ? (
                      <ItemContainer>
                        {data.Media.characters.edges.map((cast, index) => (
                          <PeopleButton
                            key={index}
                            onClick={() =>
                              this.props.history.push(`/fig?${
                                  cast.voiceActors &&
                                  cast.voiceActors.length > 0
                                    ? 's'
                                    : 'c'
                                }=${
                                  cast.voiceActors &&
                                  cast.voiceActors.length > 0
                                    ? cast.voiceActors.filter(j => j.language === 'JAPANESE')[0].id
                                    : cast.node.id
                                }`)
                            }
                            image={
                              cast.voiceActors && cast.voiceActors.length > 0
                                ? cast.voiceActors.filter(j => j.language === 'JAPANESE')[0]
                                  ? cast.voiceActors.filter(j => j.language === 'JAPANESE')[0].image.large
                                  : null
                                : cast.node.image.large
                            }
                            actor={
                              !!(
                                cast.voiceActors && cast.voiceActors.length > 0
                              )
                            }
                            name={{
                              first:
                                cast.voiceActors && cast.voiceActors.length > 0
                                  ? cast.voiceActors[0].name.first
                                  : cast.node.name.first,
                              last:
                                cast.voiceActors && cast.voiceActors.length > 0
                                  ? cast.voiceActors[0].name.last
                                  : cast.node.name.last,
                            }}
                            charImg={cast.node.image.large}
                            charOnClick={() =>
                              this.openEntity(`/fig?c=${cast.node.id}`)
                            }
                            actor={
                              !!(
                                cast.voiceActors && cast.voiceActors.length > 0
                              )
                            }
                            role={
                              cast.voiceActors && cast.voiceActors.length > 0
                                ? `${lang.show.as} ${
                                    cast.node.name.last
                                      ? `${cast.node.name.first} ${
                                          cast.node.name.last
                                        }`
                                      : cast.node.name.first
                                  }`
                                : cast.role
                            }
                          />
                        ))}
                      </ItemContainer>
                    ) : null}
                    {data.Media.characters &&
                    data.Media.characters.edges.length > 0 ? (
                      <Divider className={classes.sectDivideDown} />
                    ) : null}
                    <SectionTitle title={lang.show.staff} />
                    <ItemContainer>
                      {data.Media.staff &&
                        data.Media.staff.edges.map((staff, index) => (
                          <PeopleButton
                            key={index}
                            image={staff.node.image.medium}
                            name={{
                              first: staff.node.name.first,
                              last: staff.node.name.last,
                            }}
                            role={staff.role}
                            onClick={() =>
                              this.props.history.push(`/fig?s=${staff.node.id}`)
                            }
                          />
                        ))}
                    </ItemContainer>
                    <Divider className={classes.sectDivideDown} />
                    <SectionTitle title={lang.show.similar} />
                    <ItemContainer>
                      {data.Media.relations &&
                        data.Media.relations.edges.map((anime, index) => (
                          <CardButton
                            key={index}
                            image={anime.node.coverImage.large}
                            title={anime.node.title.romaji}
                            subtitle={`${
                              anime.node.type
                            } ${anime.relationType.replace(/_/gi, ' ')}`}
                            onClick={() =>
                              this.openEntity(`/show?${
                                  anime.node.type.includes('ANIME') ? 's' : 'm'
                                }=${anime.node.id}`)
                            }
                          />
                        ))}
                      {data.Media.tags &&
                        data.Media.tags.length > 0 &&
                        similars &&
                        similars.data &&
                        similars.data.Page.media &&
                        this.props.mir.twist &&
                        TwistFilter(
                          similars.data.Page.media,
                          this.props.mir.twist,
                        )
                          .filter(a => a.id !== data.Media.id)
                          .splice(0, 8)
                          .map((anime, index) => (
                            <CardButton
                              key={index}
                              image={anime.coverImage.large}
                              title={anime.title.romaji}
                              subtitle="SIMILAR"
                              onClick={() =>
                                this.openEntity(`/show?${
                                    anime.type.includes('ANIME') ? 's' : 'm'
                                  }=${anime.id}`)
                              }
                            />
                          ))}
                      {data.Media.tags &&
                        data.Media.tags.length > 1 &&
                        similars2 &&
                        similars2.data &&
                        similars2.data.Page.media &&
                        this.props.mir.twist &&
                        TwistFilter(
                          similars2.data.Page.media,
                          this.props.mir.twist,
                        )
                          .filter(a => a.id !== data.Media.id)
                          .splice(0, 8)
                          .map((anime, index) => (
                            <CardButton
                              key={index}
                              image={anime.coverImage.large}
                              title={anime.title.romaji}
                              subtitle="SIMILAR"
                              onClick={() =>
                                this.openEntity(`/show?${
                                    anime.type.includes('ANIME') ? 's' : 'm'
                                  }=${anime.id}`)
                              }
                            />
                          ))}
                    </ItemContainer>
                  </Grid>
                </Container>
              </MainCard>
            </div>
          ) : null}
        </Root>
      </div>
    );
  }
}
export const updateMirTitle = title => ({
  type: MIR_SET_TITLE,
  title,
});

export const loadPlayer = play => ({
  type: MIR_PLAY_SHOW,
  play,
});

const mapPTS = dispatch => ({
  sendTitleToMir: title => dispatch(updateMirTitle(title)),
  sendDataToMir: async play => dispatch(loadPlayer(play)),
});

export default firebaseConnect()(connect(({ firebase: { profile }, mir }) => ({ profile, mir }), mapPTS)(withStyles(styles, { withTheme: true })(Show)));
