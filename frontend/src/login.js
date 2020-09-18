import * as React from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { ThemeProvider, makeStyles, styled } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import GREY from '@material-ui/core/colors/grey';
import { GoogleLogin } from 'react-google-login';

import config from './config'

const LoginPaper = styled(Paper)({
    padding: '30px',
});

export const loginTheme = createMuiTheme({
    palette: {
      background: {
        default: GREY[200]
      }
    },
    typography: {
        fontFamily: ['Nunito Sans', 'Helvetica', 'Arial', 'sans-serif']
    }
});

const useStyles = makeStyles({
    root: {
        width: '400px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        '-webkit-transform': 'translate(-50%, -50%)',
        transform: 'translate(-50%, -50%)'
    },
    centeredBlock: {
        'margin-left': 'auto',
        'margin-right': 'auto'
    },
    centeredText: {
        'text-align': 'center'
    }
});


const LoginPage = (props) => {
    const notify = useNotify();
    const login = useLogin();
    const classes = useStyles(props);
    const responseGoogle = (response) => {
        if('code' in response) {
            login({ code: response.code })
            return
        }
        console.error(response)
        notify('Sign in with Google failed')
    }

    return (
        <ThemeProvider theme={loginTheme}>
            <CssBaseline />
            <Notification />
            <div className={classes.root}>
                <LoginPaper elevation={3} className={classes.centeredText}>
                    <img src="techlabs-logo.svg" className={classes.centeredBlock} alt="TechLabs Logo" />
                    <h1 className={classes.centeredText}>Techie Relationship Management</h1>
                    <GoogleLogin
                        clientId={config.oAuth.clientId}
                        hostedDomain={config.oAuth.hostedDomain}
                        scope="profile email https://www.googleapis.com/auth/admin.directory.group.readonly"
                        responseType="code"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </LoginPaper>
            </div>
        </ThemeProvider>
    );
};

export default LoginPage;
