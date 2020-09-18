import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';
import UserIcon from '@material-ui/icons/People';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import CommentIcon from '@material-ui/icons/Comment';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';

import dataProvider from './dataProvider';
import authProvider from './authProvider';
import i18nProvider from './i18nProvider';
import LoginPage from './login';
import { theme } from './theme';
import { TechieList, TechieEdit } from './techies';
import { FormList, FormEdit, FormCreate } from './forms';
import { SemesterList, SemesterEdit, SemesterCreate } from './semesters';
import { FormResponseList, FormResponseShow } from './form_responses';

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
            <Resource name="techies" list={TechieList} edit={TechieEdit} icon={UserIcon} />
            <Resource name="forms" list={FormList} edit={FormEdit} create={FormCreate} icon={ChatBubbleOutlineIcon} />
            <Resource name="form_responses" list={FormResponseList} show={FormResponseShow} icon={CommentIcon} />
            <Resource name="semesters" list={SemesterList} edit={SemesterEdit} create={SemesterCreate} icon={QueryBuilderIcon} />
          </Admin>
      );
  }
}

export default App;
