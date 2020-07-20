import React from 'react';
import {
  Redirect,
  Route as ReactDOMRoute,
  RouteProps as ReactDOMProps,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...props
}) => {
  const { user } = useAuth();
  const isSignedIn = !!user;

  return (
    <ReactDOMRoute
      {...props}
      render={({ location }) => {
        if (isPrivate === isSignedIn) {
          return <Component />;
        }
        return (
          <Redirect
            to={{
              state: { from: location },
              pathname: isPrivate ? '/' : 'dashboard',
            }}
          />
        );
      }}
    />
  );
};

export default Route;
