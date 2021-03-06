import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter, Redirect} from 'react-router-dom';
import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import Add from './Add';
import Home from './home';
import LoginPage from './login-form';
import RegistrationPage from './registration-page';
import {refreshAuthToken} from '../actions/auth';
import Comic from './Comic';

export class App extends React.Component {
    componentDidMount() {
        if (this.props.hasAuthToken) {
            // Try to get a fresh auth token if we had an existing one in
            // localStorage
            this.props.dispatch(refreshAuthToken());
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loggedIn && !this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
        } else if (!nextProps.loggedIn && this.props.loggedIn) {
            // Stop refreshing when we log out
            this.stopPeriodicRefresh();
        }
    }

    componentWillUnmount() {
        this.stopPeriodicRefresh();
    }

    startPeriodicRefresh() {
        this.refreshInterval = setInterval(
            () => this.props.dispatch(refreshAuthToken()),
            60 * 60 * 1000 // One hour
        );
    }

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

    render() {
        return (
            <div className="app">
                <HeaderBar />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/registration-form" component={RegistrationPage} />
                <Route exact path="/add" component={Add} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/login-form" component={LoginPage} />
                <Route exact path="/comic/:comicId" component={Comic}/>
                <Redirect from='*' to='/'/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    // console.log(state.auth);
    return {
        hasAuthToken: state.auth.authToken !== null,
        loggedIn: state.auth.currentUser !== null
    }
};

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
