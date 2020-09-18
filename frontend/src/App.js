import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';
import UserIcon from '@material-ui/icons/People';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import CommentIcon from '@material-ui/icons/Comment';

import dataProvider from './dataProvider';
import authProvider from './authProvider';
import i18nProvider from './i18nProvider';
import LoginPage from './login';
import { theme } from './theme';
import { TechieList, TechieEdit, TechieCreate } from './techies';
import { FormList, FormEdit, FormCreate } from './forms';
import { FormSubmissionList, FormSubmissionShow } from './form_submissions';

class App extends Component {
  render() {
      return (
          <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            loginPage={LoginPage}
            theme={theme}
          >
            <Resource name="techies" list={TechieList} edit={TechieEdit} create={TechieCreate} icon={UserIcon} />
            <Resource name="forms" list={FormList} edit={FormEdit} create={FormCreate} icon={ChatBubbleOutlineIcon} />
            <Resource name="form_submissions" list={FormSubmissionList} show={FormSubmissionShow} icon={CommentIcon} />
          </Admin>
      );
  }
}

export default App;
