import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import SessionList from './component/session/SessionList'
import Header from './component/layout/Header'
import SessionVote from './component/session/SessionVote'
import { withStyles } from '@material-ui/core'
import './App.css'
import { connect } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { setFavicon } from './component/layout/utils'
import { authActions } from './component/auth'
import {
    getProjectLoadError,
    getProjectSelector,
    getProjectVotesError
} from './component/project/projectSelectors'
import * as projectActions from './component/project/projectActions'
import red from '@material-ui/core/colors/red'
import Error from './component/customComponent/Error'
import LoaderMatchParent from './component/customComponent/LoaderMatchParent'
import { getLoginErrorSelector } from './component/auth/authSelectors'

const theme = createMuiTheme({
    color: {
        primary: red
        // secondary: {
        //     main: '#51B6FF'
        // }
    },
    typography: {
        useNextVariants: true
    },
    spacing: {
        default: 16
    }
})

const styles = theme => ({
    loading: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    layout: {
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        boxSizing: 'border-box',
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing.unit * 2,
            paddingRight: theme.spacing.unit * 2
        }
    }
})

class App extends Component {
    componentWillMount() {
        const id = this.props.match.params.projectId
        this.props.getProject(id)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.project) {
            const project = nextProps.project
            document.title = project.name + ' - Feedback'
            setFavicon(project.favicon)
            this.props.signIn()
        }
    }

    render() {
        const {
            classes,
            match,
            project,
            projectLoadError,
            projectVotesError,
            loginError
        } = this.props

        if (loginError) {
            return (
                <MuiThemeProvider theme={theme}>
                    <Error
                        error="Fail to anonymously login you."
                        errorDetail={loginError}
                    />
                </MuiThemeProvider>
            )
        } else if (projectLoadError) {
            return (
                <MuiThemeProvider theme={theme}>
                    <Error
                        error="Unable to load the project."
                        errorDetail={projectLoadError}
                    />
                </MuiThemeProvider>
            )
        } else if (projectVotesError) {
            return (
                <MuiThemeProvider theme={theme}>
                    <Error
                        error="Unable to load the votes and/or the vote options."
                        errorDetail={projectVotesError}
                    />
                </MuiThemeProvider>
            )
        } else if (!project) {
            return (
                <MuiThemeProvider theme={theme}>
                    <LoaderMatchParent />
                </MuiThemeProvider>
            )
        } else {
            return (
                <MuiThemeProvider theme={theme}>
                    <div>
                        <Header logo={project.logoSmall} />

                        <div className={classes.layout}>
                            <br />

                            <Switch>
                                <Route
                                    exact
                                    path={`${match.path}`}
                                    component={SessionList}
                                />
                                <Route
                                    path={`${match.path}/:sessionId`}
                                    component={SessionVote}
                                />
                            </Switch>

                            <br />
                        </div>
                    </div>
                </MuiThemeProvider>
            )
        }
    }
}

const mapStateToProps = state => ({
    project: getProjectSelector(state),
    projectLoadError: getProjectLoadError(state),
    projectVotesError: getProjectVotesError(state),
    loginError: getLoginErrorSelector(state)
})

const mapDispatchToProps = Object.assign({}, projectActions, authActions)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(App))
