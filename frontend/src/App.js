import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';

import dataProvider from './dataProvider';
import authProvider from './authProvider';
import LoginPage from './login';
import { theme } from './theme';
import { TechieList, TechieEdit, TechieCreate } from './techies';
import { FormList, FormEdit, FormCreate } from './forms';
import { FormSubmissionList, FormSubmissionShow } from './form_submissions';

class App extends Component {
  render() {
      return (
          <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={LoginPage} theme={theme}>
            <Resource name="techies" list={TechieList} edit={TechieEdit} create={TechieCreate} />
            <Resource name="forms" list={FormList} edit={FormEdit} create={FormCreate} />
            <Resource name="form_submissions" list={FormSubmissionList} show={FormSubmissionShow} />
          </Admin>
      );
  }
}

export default App;
