import React from 'react';
import materialize from './materialize';
import {Route, Switch, withRouter} from 'react-router-dom';
import Bar from './components/bar';
import Home from './routes/home';
import ToS from './routes/tos';
import FourOFour from './routes/404';
import Splash from './routes/splash';
import Social from './routes/social';
import Sharestreams from './routes/sharestreams';
import Explore from './routes/explore';
import Anime from './routes/anime';
import Account from './routes/account';
import Crash from './routes/crash';
import Pri from './routes/pri';
import Faq from './routes/faq';
import * as firebase from "firebase";
import {User} from "firebase";
import Wizard from "./components/Wizard";
import Loader from "./components/Loader";

interface IApp {
    children: React.ReactChildren;
    history: any;
}

class App extends React.PureComponent<IApp> {

    auth = firebase.auth();

    state = {
        user: null,
        loading: true,
        error: undefined
    };

    constructor(props: any) {
        super(props);

        this.auth.onAuthStateChanged((user: User | null) => {
            if (user)
                setTimeout(() => this.setState({user, loading: false}), 500);
            else {
                setTimeout(() => this.setState({loading: false}), 500)
            }
        })
    }

    componentDidCatch(error: Error) {
        console.error(`[Mirai] ${error}`);
        this.setState({error});
    }

    triggerLoading = () => this.setState({loading: true});

    render() {
        const {user, loading, error} = this.state;
        if (Boolean(error)) return <Crash error={error}/>
        if (loading) return <Loader loading={loading}/>;
        if (!user && !loading) return <Wizard callback={this.triggerLoading.bind(this)}/>;
        return (
            <div className="Mirai">
                <Bar history={this.props.history}/>
                <Switch>
                    <Route exact path="/" component={Splash}/>
                    <Route exact path="/home" component={Home}/>
                    <Route exact path="/tos" component={ToS}/>
                    <Route exact path="/pri" component={Pri}/>
                    <Route exact path="/faq" component={Faq}/>
                    <Route exact path="/social" component={Social}/>
                    <Route exact path="/sharestreams" component={Sharestreams}/>
                    <Route exact path="/explore" component={Explore}/>
                    <Route exact path="/anime" component={Anime}/>
                    <Route exact path="/account" component={Account}/>
                    <Route component={FourOFour}/>
                </Switch>
            </div>
        );
    }
}

export default withRouter(materialize(App));
