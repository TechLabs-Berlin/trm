import * as React from "react";
import { Layout } from 'react-admin';
import TRMAppBar from './trmAppBar';

const TRMLayout = (props) => <Layout {...props} appBar={TRMAppBar} />;

export default TRMLayout;
