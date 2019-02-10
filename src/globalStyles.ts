// Global MUI styles for all components to impose consistency.
export default (theme: any) => ({
    appBar: {
        boxShadow: 'none',
        background: 'transparent'
    },
    grid: {
        flexDirection: 'column'
    },
    bannerToolbarBG: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: theme.mixins.toolbar.minHeight * 1.15
    },
    bannerGrid: {
        padding: theme.spacing.unit * 8,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: theme.mixins.toolbar.minHeight * 2
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        filter: 'brightness(0.2)',
        top: 0,
        left: 0,
        zIndex: -2,
        background: 'rgba(0,0,0,1)'
    },
    bannerColor: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        opacity: 0.7,
        top: 0,
        left: 0,
        zIndex: -1,
    },
    bannerVideo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'brightness(0.4) blur(20px)',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -2
    },
    bannerButtons: {
        marginTop: theme.spacing.unit * 4
    },
    section: {
        width: '100%'
    },
    sectionTitle: {
        padding: `${theme.spacing.unit * 4}px 0`
    },
    sectionGrid: {},
    innerMargin: {
        maxWidth: 960,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
    },
    player: {
        width: '100%',
        height: '100%',
        background: '#000',
        marginBottom: theme.spacing.unit,
        marginTop: theme.spacing.unit
    },
    playerInactive: {
        height: 0,
        background: 'transparent',
        opacity: 0,
        pointerEvents: 'none'
    },
    coverImage: {
        width: 181,
        height: 250,
        objectFit: 'cover',
        borderRadius: 4,
        boxShadow: theme.shadows[3]
    },
    mainModal: {
        position: 'absolute',
        width: theme.spacing.unit * 60,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%)`
    },
    textTitle: {
        margin: '8pt 0',
    },
    textParagraph: {
        margin: '8pt 0'
    },
    textDivider: {
        margin: '8pt 0'
    }
});
