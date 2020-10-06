import * as React from "react";
import { Route } from 'react-router-dom';
import CSVImportPage from './features/csv-import/page';

export default [
    <Route exact path="/csv-import" component={CSVImportPage} />
];
