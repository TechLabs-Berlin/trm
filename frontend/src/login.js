import * as React from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { GoogleLogin } from 'react-google-login';

import { theme } from './theme'
import config from './config'

const LoginPage = () => {
    const notify = useNotify();
    const login = useLogin();
    const responseGoogle = (response) => {
        if('code' in response) {
            login({ code: response.code })
            return
        }
        console.error(response)
        notify('Sign in with Google failed')
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="google-login-container">
                <GoogleLogin
                    clientId={config.oAuth.clientId}
                    hostedDomain={config.oAuth.hostedDomain}
                    scope="profile email https://www.googleapis.com/auth/admin.directory.group.readonly"
                    responseType="code"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
            <Notification />
        </ThemeProvider>
    );
};

export default LoginPage;
