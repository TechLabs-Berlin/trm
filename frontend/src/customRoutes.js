import * as React from "react";
import { Route } from 'react-router-dom';
import CSVImportPage from './features/csv-import/page';
import { TechieActivityPage } from './features/techie-activity/page'

export default [
    <Route exact path="/csv-import" component={CSVImportPage} />,
    <Route exact path="/techie-activity" component={TechieActivityPage} />,
    <Route exact path='/user-handbook' component={() => window.open('https://www.notion.so/techlabs/TRM-User-Handbook-5cbfa19213084c2f996b8311fcc4d71a', '_new')} />
];
