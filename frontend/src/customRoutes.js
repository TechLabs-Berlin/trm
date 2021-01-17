import * as React from "react";
import { Route } from 'react-router-dom';
import CSVImportPage from './features/csv-import/page'
import DashboardPage from './features/dashboard/page'

const routes = [
    <Route exact path="/dashboard" component={DashboardPage} />,
    <Route exact path="/csv-import" component={CSVImportPage} />,
    <Route exact path='/user-handbook' component={() => window.open('https://www.notion.so/techlabs/TRM-User-Handbook-5cbfa19213084c2f996b8311fcc4d71a', '_new')} />
]

export default routes
