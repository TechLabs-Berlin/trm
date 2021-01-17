import React, { Component } from 'react';
import { Admin, Resource } from 'react-admin';

import dataProvider from './dataProvider';
import authProvider from './authProvider';
import i18nProvider from './i18nProvider';
import customRoutes from './customRoutes'
import LoginPage from './login';
import { theme } from './theme';
import Layout from './components/trmLayout'
import { TechieList, TechieEdit } from './techies';
import { FormList, FormEdit, FormCreate } from './forms';
import { SemesterList, SemesterEdit, SemesterCreate } from './semesters';
import { FormResponseList, FormResponseEdit } from './form_responses';
import { TeamMemberList, TeamMemberEdit, TeamMemberCreate, TeamMemberShow } from './team_members';
import { TechieActivityReportList } from './features/techie-activity/page'
import DashboardPage from './features/dashboard/page'
class App extends Component {
  render() {
      return (
          <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            customRoutes={customRoutes}
            loginPage={LoginPage}
            theme={theme}
            layout={Layout}
            dashboard={DashboardPage}
          >
            <Resource name="techies" list={TechieList} edit={TechieEdit} />
            <Resource name="forms" list={FormList} edit={FormEdit} create={FormCreate} />
            <Resource name="form_responses" list={FormResponseList} edit={FormResponseEdit} />
            <Resource name="semesters" list={SemesterList} edit={SemesterEdit} create={SemesterCreate} />
            <Resource name="team_members" list={TeamMemberList} show={TeamMemberShow} edit={TeamMemberEdit} create={TeamMemberCreate} />
            <Resource name="techie_activity_report" list={TechieActivityReportList} />
          </Admin>
      );
  }
}

export default App;
