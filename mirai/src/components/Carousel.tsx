import React from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Fab,
    Fade,
    Theme,
    Typography,
    withStyles
} from '@material-ui/core';
import {ArrowBack, ArrowForward} from '@material-ui/icons';
import {realBoxShadow, realNearBoxShadow} from '../globalStyles';
import ReactAliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import {Data} from "../api/kitsu";

const styles = (theme: Theme) => ({
    _container: {
        boxShadow: realNearBoxShadow
    },
    _card: {
        boxShadow: realBoxShadow,
        display: 'flex',
        height: 200
    },
    _cardAction: {},
    _cardDetails: {
        display: 'flex',
        flexDirection: 'column'
    },
    _cardContent: {
        flex: '1 0 auto',
        zIndex: 1
    },
    _cardMedia: {
        width: 180,
        zIndex: 1
    },
    _cardImage: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.15,
        overflow: 'hidden',
        objectFit: 'cover',
        transform: 'scale(1.5)'
    },
    _leftButton: {
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        boxShadow: realBoxShadow,
    },
    _rightButton: {
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        right: -50,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        boxShadow: realBoxShadow,
    }
});

class Carousel extends React.Component<any> {
    galleryItems = () => {
        const {classes, items, click} = this.props;
        if (!items) return null;
        return items.map((e: Data, i: number) =>
            <Fade in={true}><Card className={classes._card} key={i}>
                <CardMedia
                    className={classes._cardMedia}
                    image={e.attributes.posterImage.original}
                    title={e.attributes.titles.en_jp}
                />
                <CardActionArea className={classes._cardAction} onClick={() => click(e)}>
                    <img src={e.attributes.coverImage ? e.attributes.coverImage.original : ""} alt=''
                         className={classes._cardImage}/>
                    <div className={classes._cardDetails}>
                        <CardContent className={classes._cardContent}>
                            <Typography gutterBottom variant="h5">
                                {e.attributes.titles.en_jp}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {e.attributes.status}
                            </Typography>
                        </CardContent>
                    </div>
                </CardActionArea>
            </Card>
            </Fade>
        )
    };

    state = {
        galleryItems: this.galleryItems(),
        responsive: {1024: {items: 3}},
        activeItemIndex: 0
    };

    slideTo = (i: number) => this.setState({activeItemIndex: i});

    onSlideChanged = (e: any) => this.setState({activeItemIndex: e.item});

    slideNext = () => this.setState({activeItemIndex: this.state.activeItemIndex + 1});

    slidePrev = () => this.setState({activeItemIndex: this.state.activeItemIndex - 1});

    thumbItem = (item: any, i: number) => <Chip size="small" style={{marginLeft: 4, marginRight: 4}}
                                                color={this.state.activeItemIndex === i ? "primary" : "default"}
                                                onClick={() => this.slideTo(i)}></Chip>;

    render() {
        const {classes} = this.props;
        const {activeItemIndex, galleryItems, responsive} = this.state;
        return (<div style={{position: 'relative'}}>
                <div className={classes._container}><ReactAliceCarousel buttonsDisabled dotsDisabled
                                                                        items={galleryItems}
                                                                        slideToIndex={activeItemIndex}
                                                                        responsive={responsive}
                                                                        onSlideChanged={this.onSlideChanged}
                                                                        infinite={false} fadeOutAnimation={true}
                >
                </ReactAliceCarousel></div>
                <Fab color='primary' variant='round' className={classes._leftButton}
                     onClick={() => this.slidePrev()}><ArrowBack/></Fab>
                <Fab color='primary' variant='round' className={classes._rightButton}
                     onClick={() => this.slideNext()}><ArrowForward/></Fab>
            </div>
        );
    }
}

export default withStyles(styles as any)(Carousel);