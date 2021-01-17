import * as React from "react";

import {
  Title,
  // useDataProvider
} from 'react-admin';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import {
  Typography
} from '@material-ui/core'

const DashboardPage = () => (
  <Card>
      <Title title="Dashboard" />
      <CardContent>
        <Typography variant="h3">
          Welcome to the TRM!
        </Typography>
      </CardContent>
  </Card>
)

export default DashboardPage
