import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SupportTickets from './components/support/SupportTickets';
import AzureSupport from './components/support/AzureSupport'; // New component for Azure support

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/support" component={SupportTickets} />
        <Route path="/support/azure" component={AzureSupport} />
        {/* Add more routes as needed */}
      </Switch>
    </Router>
  );
};

export default AppRouter;