import * as React from "react";
import { Layout } from 'react-admin';

import TRMAppBar from './trmAppBar';
import TRMMenu from './trmMenu';

const TRMLayout = (props) => <Layout {...props} appBar={TRMAppBar} menu={TRMMenu} />;

export default TRMLayout;
